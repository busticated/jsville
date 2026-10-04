[**@bust/eslint-config**](../README.md)

***

# Interface: BustConfigOptions

Defined in: [index.ts:101](/packages/eslint-config/src/index.ts#L101)

Options accepted by [bust](../functions/bust.md).

## Properties

### allowDefaultProject?

> `optional` **allowDefaultProject?**: `string`[]

Defined in: [index.ts:158](/packages/eslint-config/src/index.ts#L158)

Files to type-check outside the project's `tsconfig.json` - an
`eslint.config.js` that the tsconfig lists but `allowJs` excludes, for
instance.

***

### ignores?

> `optional` **ignores?**: `string`[]

Defined in: [index.ts:160](/packages/eslint-config/src/index.ts#L160)

Paths to ignore, added to [DEFAULT\_IGNORES](../variables/DEFAULT_IGNORES.md).

***

### nodeTest?

> `optional` **nodeTest?**: `boolean`

Defined in: [index.ts:138](/packages/eslint-config/src/index.ts#L138)

Relax the type-aware rules that Node's test runner trips over. Has no
effect without `typeAware`, which is what turns those rules on.

#### Default Value

```ts
false
```

***

### react?

> `optional` **react?**: `boolean`

Defined in: [index.ts:125](/packages/eslint-config/src/index.ts#L125)

Add React rules: `@eslint-react` plus the hooks plugin, and the JSX
half of the stylistic rules.

#### Default Value

```ts
false
```

***

### strict?

> `optional` **strict?**: `boolean`

Defined in: [index.ts:146](/packages/eslint-config/src/index.ts#L146)

Enforce the stricter conventions: blank lines between statements,
declaration order, constant naming, and - with a test runner on - test
suite structure. See the README for the full list.

#### Default Value

```ts
false
```

***

### tsconfigRootDir?

> `optional` **tsconfigRootDir?**: `string`

Defined in: [index.ts:152](/packages/eslint-config/src/index.ts#L152)

Where the type-aware project service looks for `tsconfig.json`.

#### Default Value

`process.cwd()`

***

### typeAware?

> `optional` **typeAware?**: `boolean`

Defined in: [index.ts:118](/packages/eslint-config/src/index.ts#L118)

Add the rules that need type information - the ones that catch a
promise nobody awaited. Requires `typescript`, and requires the
project's `tsconfig.json` to cover every linted file.

#### Default Value

```ts
true
```

***

### typescript?

> `optional` **typescript?**: `boolean`

Defined in: [index.ts:110](/packages/eslint-config/src/index.ts#L110)

Lint TypeScript. Adds `typescript-eslint`'s recommended rules and the
TS-aware variants of `no-unused-vars` and `no-use-before-define`.
Turning this off yields the JS-only configuration - the same rules,
minus anything that needs a TypeScript parser.

#### Default Value

```ts
true
```

***

### vitest?

> `optional` **vitest?**: `boolean`

Defined in: [index.ts:131](/packages/eslint-config/src/index.ts#L131)

Add Vitest's recommended rules, scoped to `*.test.*` files.

#### Default Value

```ts
false
```
