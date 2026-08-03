[**@bust/config**](../../README.md)

***

# Function: getBrowserEnv()

> **getBrowserEnv**(): [`ConfigEnvVars`](../../node/interfaces/ConfigEnvVars.md)

Defined in: [browser.mts:19](/packages/config/src/browser.mts#L19)

Reads the settings blob the end-user's bundler baked in via
`getBrowserDefine()` (see `node.ts`), falling back to an empty object when
it's unavailable (e.g. running un-bundled, or the consumer hasn't wired up
`define` yet) - in which case settings just fall back to their defaults.

## Returns

[`ConfigEnvVars`](../../node/interfaces/ConfigEnvVars.md)
