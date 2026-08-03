[**@bust/config**](../../README.md)

***

# Interface: SettingsSchemaTree

Defined in: [types.ts:87](/packages/config/src/types.ts#L87)

An author-supplied configuration schema: an arbitrarily-nested tree whose
leaves are SettingsSpecInputs. Nesting maps to dot-delimited
SettingsKeys - `{ app: { name: {...} } }` produces the key `'app.name'`.

## Example

```ts
const schema: SettingsSchemaTree = {
	app: {
		name: { default: 'My App', env: 'MY_APP_NAME', public: true },
		url: { default: 'http://localhost:1234', format: 'url', env: 'MY_APP_URL' },
	},
};
```

## Indexable

> \[`key`: `string`\]: `SettingsSpecInput` \| `SettingsSchemaTree`
