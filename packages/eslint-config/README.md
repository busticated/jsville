# `@bust/eslint-config`

Shared ESLint configuration for Busticated JS/TS projects


## Installation

```shell
npm install @bust/eslint-config --save-dev
```

`eslint` is a peer dependency - everything else this config needs (`typescript-eslint`, `@stylistic`, the React and Vitest plugins) ships with it, so there is nothing else to install.


## Usage

Call the factory from your `eslint.config.js` and export the result. It targets TypeScript by default, with type-aware rules on.

```js
// eslint.config.js
import bust from '@bust/eslint-config';

export default bust();
```

Options turn on the layers a project needs:

```js
export default bust({
	react: true,
	vitest: true,
	ignores: ['.output/', '.nitro/'],
});
```

### JavaScript-only projects

`typescript: false` drops `typescript-eslint` and the type-aware rules, keeping the same core and stylistic rules with the built-in `no-unused-vars` and `no-use-before-define` in place of their TS-aware equivalents.

```js
export default bust({ typescript: false });
```

### Type-aware rules

These are on by default and need your `tsconfig.json` to cover every file being linted. A file the tsconfig lists but excludes - an `eslint.config.js` in a project without `allowJs`, say - needs naming explicitly:

```js
export default bust({ allowDefaultProject: ['eslint.config.js'] });
```

Turn them off with `typeAware: false` if a project's tsconfig isn't ready for it.

### Overriding

The factory returns a flat-config array, so append your own blocks - later blocks win:

```js
export default [
	...bust(),
	{
		files: ['bin/**'],
		rules: { 'no-console': 'off' },
	},
];
```

Every block this package contributes is named `bust/*`, so `npx eslint --inspect-config` will tell you which one applied a given rule.


## API
<!-- api-docs-start -->
see [here](https://github.com/busticated/jsville/tree/%40bust%2Feslint-config%400.0.0/packages/eslint-config/docs)
<!-- api-docs-end -->

_NOTE: When in doubt, check usage in [tests](./src/index.test.ts)_


## License

_See [LICENSE.md](./LICENSE.md)_

