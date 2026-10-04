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

### Test runners

`vitest: true` adds Vitest's recommended rules. `nodeTest: true` is for projects on `node:test`, where `describe()` and `it()` return promises nobody awaits - it relaxes `no-floating-promises` across the spec, test, e2e, and integration suites, and does nothing when the type-aware rules are off.

### Strict conventions

`strict: true` is opt-in and adds the stricter conventions. Every rule below can be fixed by `eslint --fix` except the naming and ordering ones.

```js
export default bust({ react: true, vitest: true, strict: true });
```

* the file ends with a single newline
* module-level constants holding a literal - string, number, boolean, regex or plain template - are `SCREAMING_SNAKE_CASE`
* variables, types and interfaces are declared above the code that uses them, and variables above functions and classes in the same scope
* a `.forEach()` that assigns a variable or changes a collection is a `for...of` instead
* inside a block, a single-line statement is never followed by an empty line, and a `return` after a multi-line statement always is
* `if`, `for`, `while`, `switch`, `try`, function declarations, and multi-line `.forEach()` and `useX()` hook calls are preceded by an empty line unless they open the block
* a logger call is preceded and followed by an empty line, except when it opens or ends the block, sits beside another logger call, or is a single line right before `return`, `throw` or `process.exit()`

With `vitest` or `nodeTest` on, test files also follow these:

* the top-level `describe()` names the module in Title Case (`'Admin User Queries'`) or the package (`'@bust/config'`)
* a nested `describe()` names a function, component or constant - `'createThing()'`, `'<AuthForm />'` or `'MODES'` - with an optional suffix
* variables sit above the `describe()`, `it()` and hook calls in the same scope, and those calls are preceded by an empty line
* logger calls are left unpadded, since the logged line is usually the act under test
* with `vitest` only, a file has one top-level `describe()` and uses `it()` rather than `test()`

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
see [here](https://github.com/busticated/jsville/tree/%40bust%2Feslint-config%402.1.0/packages/eslint-config/docs)
<!-- api-docs-end -->

_NOTE: When in doubt, check usage in [tests](./src/index.test.ts)_


## License

_See [LICENSE.md](./LICENSE.md)_

