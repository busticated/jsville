[**@bust/eslint-config**](../README.md)

***

# Function: bust()

> **bust**(`options?`): `Config`\<`RulesConfig`\>[]

Defined in: [index.ts:119](/packages/eslint-config/src/index.ts#L119)

Builds the shared ESLint configuration.

Returns a flat-config array ready to export. Every block is named, so
`eslint --inspect-config` reports which one applied a rule. Append your own
blocks to override anything - later blocks win.

## Parameters

### options?

[`BustConfigOptions`](../interfaces/BustConfigOptions.md) = `{}`

## Returns

`Config`\<`RulesConfig`\>[]

## Examples

```js
// eslint.config.js
import bust from '@bust/eslint-config';

export default bust({ react: true, vitest: true, ignores: ['.output/'] });
```

```js
// a JS-only project, with one rule relaxed
export default [
	...bust({ typescript: false }),
	{ files: ['bin/**'], rules: { 'no-console': 'off' } },
];
```
