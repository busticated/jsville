[**@bust/config**](../../README.md)

***

# Function: getBrowserDefine()

> **getBrowserDefine**\<`S`\>(`config`): `Record`\<`string`, [`ConfigEnvVars`](../interfaces/ConfigEnvVars.md)\>

Defined in: [node.ts:62](/packages/config/src/node.ts#L62)

Produces a Vite `define` entry that exposes only `config`'s `public: true`
settings to a browser build - `createConfig()` in the browser reads this
same blob back out at runtime via [CONFIG\_GLOBAL\_NAME](../../config/variables/CONFIG_GLOBAL_NAME.md). Values never
leave the Node process beyond what `getPublicEnvVars()` already returns, so
there's no separate `VITE_`-prefixed env var to keep in sync with `schema`.

## Type Parameters

### S

`S` *extends* [`SettingsSchemaTree`](../interfaces/SettingsSchemaTree.md)

## Parameters

### config

[`Config`](../../config/classes/Config.md)\<`S`\>

## Returns

`Record`\<`string`, [`ConfigEnvVars`](../interfaces/ConfigEnvVars.md)\>

## Example

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { getBrowserDefine } from '@bust/config';
import { config } from './config.ts';

export default defineConfig({
	define: getBrowserDefine(config),
});
```
