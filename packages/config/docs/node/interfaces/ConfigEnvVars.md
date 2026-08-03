[**@bust/config**](../../README.md)

***

# Interface: ConfigEnvVars

Defined in: [types.ts:104](/packages/config/src/types.ts#L104)

A map of environment variable names to values. Values are typically raw
strings (as they'd come from `process.env`), but pre-coerced values are
also accepted, which is handy when constructing a [Config](../../config/classes/Config.md) in tests.

## Indexable

> \[`key`: `string`\]: `SettingsValue` \| `undefined`
