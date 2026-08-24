[**@bust/config**](../../README.md)

***

# Class: Config\<S\>

Defined in: [config.ts:54](/packages/config/src/config.ts#L54)

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

`S` carries the shape of the schema so `get()` can resolve a key to the
type that key holds. It is inferred by `createConfig()` in
`node.ts`/`browser.mts`; constructing a `Config` directly leaves it at the
default, where keys are plain strings and values the full
SettingsValue union.

## Type Parameters

### S

`S` *extends* [`SettingsSchemaTree`](../../node/interfaces/SettingsSchemaTree.md) = [`SettingsSchemaTree`](../../node/interfaces/SettingsSchemaTree.md)

## Constructors

### Constructor

> **new Config**\<`S`\>(`__namedParameters?`): `Config`\<`S`\>

Defined in: [config.ts:57](/packages/config/src/config.ts#L57)

#### Parameters

##### \_\_namedParameters?

`ConfigOptions` = `{}`

#### Returns

`Config`\<`S`\>

## Properties

### settings

> **settings**: `Settings`

Defined in: [config.ts:55](/packages/config/src/config.ts#L55)

## Methods

### get()

> **get**\<`K`\>(`key`): `SettingsValueAt`\<`S`, `K`\>

Defined in: [config.ts:66](/packages/config/src/config.ts#L66)

Looks up a single setting's hydrated value by its dot-delimited key.

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### key

`K`

#### Returns

`SettingsValueAt`\<`S`, `K`\>

#### Throws

if `key` isn't present in the hydrated schema

***

### getPublicEnvVars()

> **getPublicEnvVars**(): [`ConfigEnvVars`](../../node/interfaces/ConfigEnvVars.md)

Defined in: [config.ts:95](/packages/config/src/config.ts#L95)

Returns every public setting's value keyed by its *environment variable
name* rather than its schema path.

#### Returns

[`ConfigEnvVars`](../../node/interfaces/ConfigEnvVars.md)

***

### getPublicSettings()

> **getPublicSettings**(): `PublicSettings`

Defined in: [config.ts:77](/packages/config/src/config.ts#L77)

Returns every hydrated setting marked `public: true`, keyed by dot-delimited path.

#### Returns

`PublicSettings`

***

### hydrate()

> **hydrate**(`data`, `env?`): `Settings`

Defined in: [config.ts:118](/packages/config/src/config.ts#L118)

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
