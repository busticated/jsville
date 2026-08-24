[**@bust/eslint-config**](../README.md)

***

# Interface: BustConfigOptions

Defined in: [index.ts:31](/packages/eslint-config/src/index.ts#L31)

Options accepted by [bust](../functions/bust.md).

## Properties

### allowDefaultProject?

> `optional` **allowDefaultProject?**: `string`[]

Defined in: [index.ts:80](/packages/eslint-config/src/index.ts#L80)

Files to type-check outside the project's `tsconfig.json` - an
`eslint.config.js` that the tsconfig lists but `allowJs` excludes, for
instance.

***

### ignores?

> `optional` **ignores?**: `string`[]

Defined in: [index.ts:82](/packages/eslint-config/src/index.ts#L82)

Paths to ignore, added to [DEFAULT\_IGNORES](../variables/DEFAULT_IGNORES.md).

***

### nodeTest?

> `optional` **nodeTest?**: `boolean`

Defined in: [index.ts:68](/packages/eslint-config/src/index.ts#L68)

Relax the type-aware rules that Node's test runner trips over. Has no
effect without `typeAware`, which is what turns those rules on.

#### Default Value

```ts
false
```

***

### react?

> `optional` **react?**: `boolean`

Defined in: [index.ts:55](/packages/eslint-config/src/index.ts#L55)

Add React rules: `@eslint-react` plus the hooks plugin, and the JSX
half of the stylistic rules.

#### Default Value

```ts
false
```

***

### tsconfigRootDir?

> `optional` **tsconfigRootDir?**: `string`

Defined in: [index.ts:74](/packages/eslint-config/src/index.ts#L74)

Where the type-aware project service looks for `tsconfig.json`.

#### Default Value

`process.cwd()`

***

### typeAware?

> `optional` **typeAware?**: `boolean`

Defined in: [index.ts:48](/packages/eslint-config/src/index.ts#L48)

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

Defined in: [index.ts:40](/packages/eslint-config/src/index.ts#L40)

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

Defined in: [index.ts:61](/packages/eslint-config/src/index.ts#L61)

Add Vitest's recommended rules, scoped to `*.test.*` files.

#### Default Value

```ts
false
```
