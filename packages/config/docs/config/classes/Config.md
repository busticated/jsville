[**@bust/config**](../../README.md)

***

# Class: Config

Defined in: [config.ts:46](/packages/config/src/config.ts#L46)

Schema-driven configuration store. Given a [SettingsSchemaTree](../../node/interfaces/SettingsSchemaTree.md) and a
map of environment variables, hydrates each leaf setting's value from the
environment (falling back to its declared default), coercing and
validating it against its format along the way.

`Config` itself is environment-agnostic - it doesn't know about
`process.env`, `.env` files, or `import.meta.env`. Node/browser-specific
env-sourcing lives in `createConfig()` in `node.ts`/`browser.mts`.

## Example

```ts
const config = new Config({
	schema: {
		app: {
			name: { default: 'My App', env: 'MY_APP_NAME', public: true },
		},
	},
	env: process.env,
});

config.get('app.name'); // 'My App', or the value of `process.env.MY_APP_NAME`, if set
```

## Constructors

### Constructor

> **new Config**(`__namedParameters?`): `Config`

Defined in: [config.ts:49](/packages/config/src/config.ts#L49)

#### Parameters

##### \_\_namedParameters?

`ConfigOptions` = `{}`

#### Returns

`Config`

## Properties

### settings

> **settings**: `Settings`

Defined in: [config.ts:47](/packages/config/src/config.ts#L47)

## Methods

### get()

> **get**(`key`): `SettingsValue`

Defined in: [config.ts:58](/packages/config/src/config.ts#L58)

Looks up a single setting's hydrated value by its dot-delimited key.

#### Parameters

##### key

`string`

#### Returns

`SettingsValue`

#### Throws

if `key` isn't present in the hydrated schema

***

### getPublicEnvVars()

> **getPublicEnvVars**(): [`ConfigEnvVars`](../../node/interfaces/ConfigEnvVars.md)

Defined in: [config.ts:87](/packages/config/src/config.ts#L87)

Returns every public setting's value keyed by its *environment variable
name* rather than its schema path.

#### Returns

[`ConfigEnvVars`](../../node/interfaces/ConfigEnvVars.md)

***

### getPublicSettings()

> **getPublicSettings**(): `PublicSettings`

Defined in: [config.ts:69](/packages/config/src/config.ts#L69)

Returns every hydrated setting marked `public: true`, keyed by dot-delimited path.

#### Returns

`PublicSettings`

***

### hydrate()

> **hydrate**(`data`, `env?`): `Settings`

Defined in: [config.ts:110](/packages/config/src/config.ts#L110)

Walks a [SettingsSchemaTree](../../node/interfaces/SettingsSchemaTree.md), resolving each leaf's format,
coercing/validating its value from `env` (or its default), and
flattening the tree into a dot-delimited Settings map.

#### Parameters

##### data

[`SettingsSchemaTree`](../../node/interfaces/SettingsSchemaTree.md)

##### env?

[`ConfigEnvVars`](../../node/interfaces/ConfigEnvVars.md) = `{}`

#### Returns

`Settings`

#### Throws

if a leaf is missing a value and has no default, uses an
unrecognized format, or its resolved value fails that format's validator
