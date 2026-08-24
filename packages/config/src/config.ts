import type {
	SettingsKey,
	SettingsKeyOf,
	SettingsValue,
	SettingsValueAt,
	SettingsFormat,
	SettingsFormatName,
	SettingsSpecInput,
	SettingsSpec,
	SettingsSchemaTree,
	Settings,
	PublicSettings,
	ConfigEnvVars,
	ConfigOptions,
	Validator,
} from './types.js';

/**
 * The name of the global variable `@bust/config` expects to find settings stored
 * in when runnning in a browser.
 */
export const CONFIG_GLOBAL_NAME = '__BUST_CONFIG__';

/**
 * Schema-driven configuration store. Given a {@link SettingsSchemaTree} and a
 * map of environment variables, hydrates each leaf setting's value from the
 * environment (falling back to its declared default), coercing and
 * validating it against its format along the way.
 *
 * `Config` itself is environment-agnostic - it doesn't know about
 * `process.env`, `.env` files, or `import.meta.env`. Node/browser-specific
 * env-sourcing lives in `createConfig()` in `node.ts`/`browser.mts`.
 *
 * @example
 * ```ts
 * const config = new Config({
 * 	schema: {
 * 		app: {
 * 			name: { default: 'My App', env: 'MY_APP_NAME', public: true },
 * 		},
 * 	},
 * 	env: process.env,
 * });
 *
 * config.get('app.name'); // 'My App', or the value of `process.env.MY_APP_NAME`, if set
 * ```
 *
 * `S` carries the shape of the schema so `get()` can resolve a key to the
 * type that key holds. It is inferred by `createConfig()` in
 * `node.ts`/`browser.mts`; constructing a `Config` directly leaves it at the
 * default, where keys are plain strings and values the full
 * {@link SettingsValue} union.
 */
export class Config<S extends SettingsSchemaTree = SettingsSchemaTree> {
	settings: Settings;

	constructor({ schema = {}, env = {} }: ConfigOptions = {}) {
		this.settings = this.hydrate(schema as SettingsSchemaTree, env);
	}

	/**
	 * Looks up a single setting's hydrated value by its dot-delimited key.
	 *
	 * @throws if `key` isn't present in the hydrated schema
	 */
	get<K extends SettingsKeyOf<S> & string>(key: K): SettingsValueAt<S, K> {
		const spec = this.settings.get(key);

		if (!spec) {
			throw new Error(`'${key}' is not available - please ensure you've set it`);
		}

		return spec.value as SettingsValueAt<S, K>;
	}

	/** Returns every hydrated setting marked `public: true`, keyed by dot-delimited path. */
	getPublicSettings(): PublicSettings {
		const out: PublicSettings = {};

		for (const [key, spec] of this.settings) {
			if (spec.public !== true) {
				continue;
			}

			out[key] = spec;
		}

		return out;
	}

	/**
	 * Returns every public setting's value keyed by its *environment variable
	 * name* rather than its schema path.
	 */
	getPublicEnvVars(): ConfigEnvVars {
		const settings = this.getPublicSettings();
		const out: ConfigEnvVars = {};

		for (const spec of Object.values(settings)) {
			if (!spec.env) {
				continue;
			}

			out[spec.env] = spec.value;
		}

		return out;
	}

	/**
	 * Walks a {@link SettingsSchemaTree}, resolving each leaf's format,
	 * coercing/validating its value from `env` (or its default), and
	 * flattening the tree into a dot-delimited {@link Settings} map.
	 *
	 * @throws if a leaf is missing a value and has no default, uses an
	 * unrecognized format, or its resolved value fails that format's validator
	 */
	hydrate(data: SettingsSchemaTree, env: ConfigEnvVars = {}): Settings {
		const settings: Settings = new Map();

		function traverse(schema: SettingsSchemaTree | SettingsSpecInput, path: string): boolean {
			if (isSpecInput(schema)) {
				return true;
			}

			for (const name in schema) {
				if (schema.hasOwnProperty(name)) {
					const node = schema[name] as SettingsSpecInput | SettingsSchemaTree;
					const key = path
						? `${path}.${name}`
						: name;

					if (isObject(node) && traverse(node, key)) {
						const spec = node as unknown as SettingsSpecInput;
						const hydrated = spec as SettingsSpec;
						hydrated.format = getFormatter(spec);
						hydrated.value = format(spec.env ? env[spec.env] : undefined, key, spec);
						validate(key, hydrated);
						settings.set(key, hydrated);
					}
				}
			}

			return false;
		}

		traverse(data, '');

		return settings;
	}
}

function isSpecInput(node: SettingsSchemaTree | SettingsSpecInput): node is SettingsSpecInput {
	return isObject(node) && 'default' in node;
}

function getFormatter(spec: SettingsSpecInput): SettingsFormat {
	if (!spec.format) {
		return getDefaultFormatter(spec.default);
	}

	return spec.format;
}

function format(x: SettingsValue | undefined, key: SettingsKey, spec: SettingsSpecInput): SettingsValue {
	if (x == null) {
		if (spec.default == null) {
			throw new Error(`'${key}' is missing - please set it!`);
		}

		return spec.default;
	}

	try {
		switch (spec.format) {
			case 'nat':
			case 'int':
				return parseInt(x as string, 10);

			case 'number':
				return parseFloat(x as string);

			case 'boolean':
				return String(x).toLowerCase() !== 'false';

			case 'url': // TODO (busticated): return URL object?
			case 'string':
				return String(x);

			case 'array':
				return Array.isArray(x)
					? x
					: (x as string).split(',');

			case 'object':
				return JSON.parse(x as string);

			case 'regexp':
				return new RegExp(x as string);

			default:
				return x;
		}
	} catch {
		return null;
	}
}

const validators: Record<string, Validator> = {
	enum: function(key, spec) {
		const allowed = spec.format as readonly string[];

		if (!allowed.includes(spec.value as string)) {
			throw new Error(`'${key}': must be one of ${allowed.join('|')}`);
		}
	},
	int: function(key, spec) {
		if (!Number.isInteger(spec.value)) {
			throw new Error(`'${key}': must be an integer`);
		}
	},
	nat: function(key, spec) {
		if (!Number.isInteger(spec.value) || (spec.value as number) < 0) {
			throw new Error(`'${key}': must be a positive integer`);
		}
	},
	url: function(key, spec) {
		try {
			new URL(spec.value as string);
		} catch {
			throw new Error(`'${key}': must be a valid url`);
		}
	},
	boolean: function(key, spec) {
		if (typeof spec.value !== 'boolean') {
			throw new Error(`'${key}': must be a boolean`);
		}
	},
	string: function(key, spec) {
		if (typeof spec.value !== 'string') {
			throw new Error(`'${key}': must be a string`);
		}
	},
	number: function(key, spec) {
		if (typeof spec.value !== 'number' || isNaN(spec.value)) {
			throw new Error(`'${key}': must be a number`);
		}
	},
	regexp: function(key, spec) {
		if (spec?.value?.constructor?.name !== 'RegExp') {
			throw new Error(`'${key}': must be a regular expression (RegExp)`);
		}
	},
	object: function(key, spec) {
		if (!isObject(spec.value)) {
			throw new Error(`'${key}': must be an object`);
		}
	},
	array: function(key, spec) {
		if (!Array.isArray(spec.value)) {
			throw new Error(`'${key}': must be an array`);
		}
	},
};

function validate(key: SettingsKey, spec: SettingsSpec): void {
	const validator = Array.isArray(spec.format)
		? validators.enum
		: validators[spec.format as string];

	if (typeof validator !== 'function') {
		throw new Error(`'${key}' uses an unrecognized format: ${spec.format}`);
	}

	validator(key, spec);
}

function isObject(x: unknown): x is Record<string, unknown> {
	return !!x && typeof x === 'object' && !Array.isArray(x);
}

const objTypePtn = /\[.* |]/g;

function getDefaultFormatter(x: SettingsValue): SettingsFormatName {
	const type = Object.prototype.toString.call(x);
	return type.replace(objTypePtn, '').toLowerCase() as SettingsFormatName;
}
