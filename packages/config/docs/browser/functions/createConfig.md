[**@bust/config**](../../README.md)

***

# Function: createConfig()

> **createConfig**(`schema`): [`Config`](../../config/classes/Config.md)

Defined in: [browser.mts:47](/packages/config/src/browser.mts#L47)

Builds a [Config](../../config/classes/Config.md) instance for use in the browser. Settings are
sourced from the `public: true` subset of a Node-side config, baked in
at build time via `getBrowserDefine()` and your bundler - this entry
point has no dependency on any Node.js-only API.

## Parameters

### schema

[`SettingsSchemaTree`](../../node/interfaces/SettingsSchemaTree.md)

## Returns

[`Config`](../../config/classes/Config.md)

## Example

```ts
// config.ts - construct the config once and export it for the rest of
// your app to import and share
import { createConfig } from '@bust/config';
import { schema } from './schema.js';

export const config = createConfig(schema);
```
```ts
// elsewhere.ts
import { config } from './config.js';

config.get('app.name');
```

See `getBrowserDefine()` in `node.ts` for the bundler side of this.
