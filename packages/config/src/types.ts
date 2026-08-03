/**
 * The dot-delimited path used to look up a setting, e.g. `'app.name'` for a
 * schema shaped like `{ app: { name: { default: 'My App' } } }`.
 */
export type SettingsKey = string;

/** A single, already-coerced primitive setting value. */
export type SettingsPrimitive = string | number | boolean | null;

/** Any value a setting can hold once it's been coerced to its target format. */
export type SettingsValue = SettingsPrimitive | SettingsPrimitive[] | RegExp | Record<string, unknown>;

/** The built-in coercion/validation formats a setting can declare. */
export type SettingsFormatName =
	| 'int'
	| 'nat'
	| 'number'
	| 'boolean'
	| 'string'
	| 'url'
	| 'array'
	| 'object'
	| 'regexp';

/**
 * A setting's format: one of the built-in {@link SettingsFormatName}s, an
 * array of allowed string values (treated as an enum), or `undefined` to
 * infer the format from the JS type of `default`.
 */
export type SettingsFormat = SettingsFormatName | string[] | undefined;

/** Human-readable description of a setting, surfaced in generated docs. */
export type SettingsDoc = string | undefined;

/** The environment variable name a setting is sourced from, if any. */
export type SettingsEnv = string | undefined;

/** Whether a setting is safe to expose outside the server (see {@link Config.getPublicSettings}). */
export type SettingsPublic = boolean | undefined;

/**
 * A single leaf node in an author-supplied schema tree - one setting's
 * default value plus its optional format/doc/env/visibility metadata.
 *
 * @example
 * ```ts
 * const nameSetting: SettingsSpecInput = {
 * 	default: 'My App',
 * 	doc: 'The official name of the application',
 * 	env: 'MY_APP_NAME',
 * 	public: true,
 * };
 * ```
 */
export interface SettingsSpecInput {
	default: SettingsValue;
	format?: SettingsFormat;
	doc?: SettingsDoc;
	env?: SettingsEnv;
	public?: SettingsPublic;
}

/**
 * A {@link SettingsSpecInput} after `Config.hydrate()` has resolved its
 * format and coerced its value from the environment (or its default).
 */
export interface SettingsSpec extends Omit<SettingsSpecInput, 'format'> {
	format: SettingsFormat;
	value: SettingsValue;
}

/**
 * An author-supplied configuration schema: an arbitrarily-nested tree whose
 * leaves are {@link SettingsSpecInput}s. Nesting maps to dot-delimited
 * {@link SettingsKey}s - `{ app: { name: {...} } }` produces the key `'app.name'`.
 *
 * @example
 * ```ts
 * const schema: SettingsSchemaTree = {
 * 	app: {
 * 		name: { default: 'My App', env: 'MY_APP_NAME', public: true },
 * 		url: { default: 'http://localhost:1234', format: 'url', env: 'MY_APP_URL' },
 * 	},
 * };
 * ```
 */
export interface SettingsSchemaTree {
	[key: string]: SettingsSpecInput | SettingsSchemaTree;
}

/** The flattened, hydrated form of a {@link SettingsSchemaTree}: dot-delimited key to resolved spec. */
export type Settings = Map<SettingsKey, SettingsSpec>;

/** The subset of hydrated {@link Settings} whose specs are marked `public: true`, keyed the same way. */
export interface PublicSettings {
	[key: string]: SettingsSpec;
}

/**
 * A map of environment variable names to values. Values are typically raw
 * strings (as they'd come from `process.env`), but pre-coerced values are
 * also accepted, which is handy when constructing a {@link Config} in tests.
 */
export interface ConfigEnvVars {
	[key: string]: SettingsValue | undefined;
}

/** Constructor options for {@link Config}. */
export interface ConfigOptions {
	// NOTE: authored schemas are recursive and checked against `SettingsSchemaTree` at
	// runtime by `hydrate()` - TS's structural checker can't reliably verify a deeply
	// nested literal against a recursive union, so we accept `object` here and cast.
	schema?: object;
	env?: ConfigEnvVars;
}

/** The shape of a per-format validation function used internally by `Config.hydrate()`. */
export type Validator = (key: SettingsKey, spec: SettingsSpec) => void;
