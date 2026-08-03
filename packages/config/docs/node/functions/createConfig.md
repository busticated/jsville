[**@bust/config**](../../README.md)

***

# Function: createConfig()

> **createConfig**(`schema`): [`Config`](../../config/classes/Config.md)

Defined in: [node.ts:36](/packages/config/src/node.ts#L36)

Builds a [Config](../../config/classes/Config.md) for use in Node.js: a local `.env` file (if
present in the current working directory) is loaded into `process.env`
before `schema` is hydrated, so local development values can live in a
git-ignored `.env` file instead of real environment variables.

## Parameters

### schema

[`SettingsSchemaTree`](../interfaces/SettingsSchemaTree.md)

## Returns

[`Config`](../../config/classes/Config.md)

## Example

```ts
// config.ts - construct the config once and export it for the rest of
// your application to import and share
import { createConfig } from '@bust/config';

export const config = createConfig({
	app: {
		name: { default: 'My App', env: 'MY_APP_NAME', public: true },
		secret: { default: '', env: 'MY_APP_SECRET' },
	},
});
```
```ts
// elsewhere.ts
import { config } from './config.ts';

config.get('app.name');
```
