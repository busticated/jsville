[**@bust/config**](../../README.md)

***

# Function: createConfig()

> **createConfig**\<`S`\>(`schema`): [`Config`](../../config/classes/Config.md)\<`S`\>

Defined in: [browser.mts:50](/packages/config/src/browser.mts#L50)

Builds a [Config](../../config/classes/Config.md) instance for use in the browser. Settings are
sourced from the `public: true` subset of a Node-side config, baked in
at build time via `getBrowserDefine()` and your bundler - this entry
point has no dependency on any Node.js-only API.

## Type Parameters

### S

`S` *extends* [`SettingsSchemaTree`](../../node/interfaces/SettingsSchemaTree.md)

## Parameters

### schema

`S`

## Returns

[`Config`](../../config/classes/Config.md)\<`S`\>

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

config.get('app.name'); // string - typed from the schema above
```

The schema's shape is captured as `S`, so `config.get()` accepts only the
keys it declares and returns the type each one holds.

See `getBrowserDefine()` in `node.ts` for the bundler side of this.
