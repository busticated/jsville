/**
 * The dot-delimited path used to look up a setting, e.g. `'app.name'` for a
 * schema shaped like `{ app: { name: { default: 'My App' } } }`.
 */
export type SettingsKey = string;

/** A single, already-coerced primitive setting value. */
export type SettingsPrimitive = string | number | boolean | null;

/** Any value a setting can hold once it's been coerced to its target format. */
export type SettingsValue = SettingsPrimitive | readonly SettingsPrimitive[] | RegExp | Record<string, unknown>;

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
export type SettingsFormat = SettingsFormatName | readonly string[] | undefined;

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
	readonly [key: string]: SettingsSpecInput | SettingsSchemaTree;
}

/**
 * Every dot-delimited key a schema declares, as a union of string literals -
 * `{ app: { name: { default: 'My App' } } }` yields `'app.name'`.
 */
export type SettingsPath<S> = {
	[K in keyof S & string]: S[K] extends { default: unknown }
		? K
		: `${K}.${SettingsPath<S[K]>}`;
}[keyof S & string];

/**
 * The keys `Config.get()` accepts. A schema whose shape is known resolves to
 * its {@link SettingsPath} union, so typos are compile errors; one typed
 * loosely enough to carry a string index signature falls back to
 * {@link SettingsKey}, which is what an untyped `new Config()` gets.
 */
export type SettingsKeyOf<S> = string extends keyof S
	? SettingsKey
	: SettingsPath<S>;

/** The {@link SettingsSpecInput} a dot-delimited key resolves to within a schema. */
export type SettingsSpecAt<S, P extends string> = P extends `${infer Head}.${infer Rest}`
	? SettingsSpecBelow<S, Head, Rest>
	: SettingsSpecNamed<S, P>;

/** Descends one branch of a dot-delimited path on behalf of {@link SettingsSpecAt}. */
export type SettingsSpecBelow<S, Head, Rest extends string> = Head extends keyof S
	? SettingsSpecAt<S[Head], Rest>
	: never;

/** Resolves the final, undotted segment of a path on behalf of {@link SettingsSpecAt}. */
export type SettingsSpecNamed<S, K> = K extends keyof S
	? S[K]
	: never;

/** The literal types a `default` can declare that widen back to a base primitive. */
export type SettingsWidenable = string | number | boolean;

/**
 * Widens a literal inferred from a schema's `default` back to its base
 * primitive - a setting declared `default: 'My App'` holds any `string`, not
 * that one literal. Enum formats are the deliberate exception; see
 * {@link SettingsValueOf}.
 *
 * Each branch tests `T` independently and contributes `never` when it doesn't
 * apply, so the union collapses to the one that does.
 */
export type SettingsWidened<T> =
	| (T extends string ? string : never)
	| (T extends number ? number : never)
	| (T extends boolean ? boolean : never)
	| (T extends SettingsWidenable ? never : T);

/**
 * The element type behind an `array` setting, inferred from `default` where
 * it says something.
 */
export type SettingsArrayValue<Spec> = Spec extends { default: readonly (infer Element)[] }
	? SettingsArrayOf<Element>
	: string[];

/**
 * Falls back to `string[]` for an empty default, which says nothing about its
 * elements - the value can always arrive as a comma-delimited environment
 * variable, which `Config.hydrate()` splits into strings.
 */
export type SettingsArrayOf<Element> = [Element] extends [never]
	? string[]
	: SettingsWidened<Element>[];

/** The value type a spec's `default` implies when it declares no explicit format. */
export type SettingsDefaultValue<Spec> = Spec extends { default: infer Default }
	? SettingsInferredValue<Spec, Default>
	: SettingsValue;

/**
 * Reads a value type off a `default` on behalf of {@link SettingsDefaultValue}.
 * A plain-object default resolves to `Record<string, unknown>` rather than its
 * own shape: an environment variable supplies that value as JSON, so nothing
 * guarantees the keys survive.
 */
export type SettingsInferredValue<Spec, Default> =
	| (Default extends RegExp ? RegExp : never)
	| (Default extends readonly unknown[] ? SettingsArrayValue<Spec> : never)
	| (Default extends Record<string, unknown> ? Record<string, unknown> : never)
	| (Default extends SettingsWidenable | null ? SettingsWidened<Default> : never);

/** The type each built-in format name resolves to. */
export interface SettingsFormatValues {
	int: number;
	nat: number;
	number: number;
	boolean: boolean;
	string: string;
	url: string;
	object: Record<string, unknown>;
	regexp: RegExp;
}

/**
 * The type a single setting holds once hydrated, derived from its declared
 * `format` and falling back to its `default` when it declares none.
 */
export type SettingsValueOf<Spec> = [SettingsFormatOf<Spec>] extends [never]
	? SettingsDefaultValue<Spec>
	: SettingsFormatValue<Spec, SettingsFormatOf<Spec>>;

/** A spec's declared format, or `never` when it declares none. */
export type SettingsFormatOf<Spec> = Spec extends { format: infer Format }
	? Exclude<Format, undefined>
	: never;

/**
 * The type a declared `format` implies. `array` is the one format whose value
 * depends on the spec around it, and an array of allowed values resolves to
 * that union - so `format: ['a', 'b']` reads back as `'a' | 'b'` rather than
 * `string`. A format too wide to identify (a schema hoisted into its own
 * variable widens `'url'` to `string`) falls back to {@link SettingsValue}.
 *
 * Each branch tests `Format` independently and contributes `never` when it
 * doesn't apply, so the union collapses to the one that does.
 */
export type SettingsFormatValue<Spec, Format> =
	| (Format extends keyof SettingsFormatValues ? SettingsFormatValues[Format] : never)
	| (Format extends readonly string[] ? Format[number] : never)
	| (Format extends 'array' ? SettingsArrayValue<Spec> : never)
	| (Format extends SettingsFormatName | readonly string[] ? never : SettingsValue);

/**
 * The type `Config.get()` returns for a given key. Mirrors
 * {@link SettingsKeyOf}: a schema with a string index signature has no key to
 * resolve against, so it falls back to the full {@link SettingsValue} union.
 */
export type SettingsValueAt<S, K extends string> = string extends keyof S
	? SettingsValue
	: SettingsValueOf<SettingsSpecAt<S, K>>;

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
