import type { Linter } from 'eslint';
import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Build output and scratch directories every project here ignores. */
export const DEFAULT_IGNORES = ['**/dist/', '**/coverage/', '**/tmp/'];

/** Shared by the TS and JS variants of `no-unused-vars`. */
const UNUSED_VARS = {
	argsIgnorePattern: '^_',
	varsIgnorePattern: '^_',
	caughtErrorsIgnorePattern: '^_',
};

/** Shared by the TS and JS variants of `no-use-before-define`. */
const USE_BEFORE_DEFINE = {
	functions: false,
	classes: false,
	variables: false,
};

/** Options accepted by {@link bust}. */
export interface BustConfigOptions {
	/**
	 * Lint TypeScript. Adds `typescript-eslint`'s recommended rules and the
	 * TS-aware variants of `no-unused-vars` and `no-use-before-define`.
	 * Turning this off yields the JS-only configuration - the same rules,
	 * minus anything that needs a TypeScript parser.
	 *
	 * @defaultValue true
	 */
	typescript?: boolean;
	/**
	 * Add the rules that need type information - the ones that catch a
	 * promise nobody awaited. Requires `typescript`, and requires the
	 * project's `tsconfig.json` to cover every linted file.
	 *
	 * @defaultValue true
	 */
	typeAware?: boolean;
	/**
	 * Add React rules: `@eslint-react` plus the hooks plugin, and the JSX
	 * half of the stylistic rules.
	 *
	 * @defaultValue false
	 */
	react?: boolean;
	/**
	 * Add Vitest's recommended rules, scoped to `*.test.*` files.
	 *
	 * @defaultValue false
	 */
	vitest?: boolean;
	/**
	 * Where the type-aware project service looks for `tsconfig.json`.
	 *
	 * @defaultValue `process.cwd()`
	 */
	tsconfigRootDir?: string;
	/**
	 * Files to type-check outside the project's `tsconfig.json` - an
	 * `eslint.config.js` that the tsconfig lists but `allowJs` excludes, for
	 * instance.
	 */
	allowDefaultProject?: string[];
	/** Paths to ignore, added to {@link DEFAULT_IGNORES}. */
	ignores?: string[];
}

/** Applies {@link BustConfigOptions}' documented defaults. */
function resolveOptions(options: BustConfigOptions): Required<Omit<BustConfigOptions, 'allowDefaultProject'>>
	& Pick<BustConfigOptions, 'allowDefaultProject'> {
	return {
		typescript: options.typescript ?? true,
		typeAware: options.typeAware ?? true,
		react: options.react ?? false,
		vitest: options.vitest ?? false,
		tsconfigRootDir: options.tsconfigRootDir ?? process.cwd(),
		allowDefaultProject: options.allowDefaultProject,
		ignores: options.ignores ?? [],
	};
}

/** The React ruleset, in its TypeScript-aware form where that applies. */
function reactRules(typescript: boolean): Linter.Config {
	return (typescript
		? eslintReact.configs['recommended-typescript']
		: eslintReact.configs.recommended) as Linter.Config;
}

/**
 * Builds the shared ESLint configuration.
 *
 * Returns a flat-config array ready to export. Every block is named, so
 * `eslint --inspect-config` reports which one applied a rule. Append your own
 * blocks to override anything - later blocks win.
 *
 * @example
 * ```js
 * // eslint.config.js
 * import bust from '@bust/eslint-config';
 *
 * export default bust({ react: true, vitest: true, ignores: ['.output/'] });
 * ```
 * @example
 * ```js
 * // a JS-only project, with one rule relaxed
 * export default [
 * 	...bust({ typescript: false }),
 * 	{ files: ['bin/**'], rules: { 'no-console': 'off' } },
 * ];
 * ```
 */
export function bust(options: BustConfigOptions = {}): Linter.Config[] {
	const {
		typescript,
		typeAware,
		react,
		vitest: withVitest,
		tsconfigRootDir,
		allowDefaultProject,
		ignores,
	} = resolveOptions(options);
	const configs: Linter.Config[] = [
		{
			name: 'bust/ignores',
			ignores: [...DEFAULT_IGNORES, ...ignores],
		},
		js.configs.recommended,
	];

	if (typescript) {
		configs.push(...(tseslint.configs.recommended as Linter.Config[]));
	}

	configs.push({
		name: 'bust/base',
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.node, ...globals.browser },
		},
		plugins: { '@stylistic': stylistic },
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/semi-spacing': 'error',
			'@stylistic/semi-style': ['error', 'last'],
			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/eol-last': ['error', 'always'],
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/max-len': ['error', {
				code: 120,
				ignoreComments: true,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
			}],
			'@stylistic/no-multiple-empty-lines': ['error', {
				max: 2,
				maxBOF: 0,
				maxEOF: 1,
			}],
			'@stylistic/no-multi-spaces': ['error', {
				exceptions: { VariableDeclarator: true },
			}],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/no-mixed-spaces-and-tabs': 'error',
			'@stylistic/no-whitespace-before-property': 'error',
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/no-floating-decimal': 'error',
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/block-spacing': 'error',
			'@stylistic/arrow-spacing': 'error',
			'@stylistic/keyword-spacing': ['error', { before: true, after: true }],
			'@stylistic/array-bracket-spacing': ['error', 'never'],
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/space-in-parens': ['error', 'never'],
			'@stylistic/space-infix-ops': 'error',
			'@stylistic/space-unary-ops': ['error', { words: true, nonwords: false }],
			'@stylistic/multiline-ternary': ['error', 'always-multiline'],
			'block-scoped-var': 'error',
			'camelcase': ['error', { properties: 'never', ignoreDestructuring: true }],
			'complexity': ['error', 15],
			'curly': 'error',
			'eqeqeq': ['error', 'smart'],
			'func-names': ['error', 'as-needed'],
			'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
			'no-console': 'error',
			'no-extend-native': 'error',
			'no-nested-ternary': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
		},
	});

	configs.push(typescript
		? {
			name: 'bust/typescript',
			rules: {
				'@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
				'@typescript-eslint/no-inferrable-types': 'error',
				'@typescript-eslint/no-unused-vars': ['error', UNUSED_VARS],
				'@typescript-eslint/no-use-before-define': ['error', USE_BEFORE_DEFINE],
				'no-use-before-define': 'off',
			},
		}
		: {
			name: 'bust/javascript',
			rules: {
				'no-unused-vars': ['error', UNUSED_VARS],
				'no-use-before-define': ['error', USE_BEFORE_DEFINE],
			},
		});

	if (typescript && typeAware) {
		configs.push({
			name: 'bust/type-aware',
			// scoped to TypeScript: the project service throws on any file the
			// tsconfig does not cover, and a repo's stray `.mjs` scripts never are
			files: ['**/*.{ts,tsx,mts,cts}'],
			languageOptions: {
				parserOptions: {
					projectService: allowDefaultProject
						? { allowDefaultProject }
						: true,
					tsconfigRootDir,
				},
			},
			rules: {
				'@typescript-eslint/await-thenable': 'error',
				'@typescript-eslint/no-floating-promises': 'error',
				'@typescript-eslint/no-misused-promises': 'error',
			},
		});
	}

	if (react) {
		configs.push(
			{
				// the plugin's config carries its own `name`, so it is spread
				// first and ours wins
				...reactRules(typescript),
				name: 'bust/react',
				files: ['**/*.{jsx,tsx}'],
			},
			{
				name: 'bust/react-stylistic',
				files: ['**/*.{jsx,tsx}'],
				plugins: { '@stylistic': stylistic },
				rules: {
					'@stylistic/jsx-quotes': ['error', 'prefer-double'],
					'@stylistic/jsx-indent-props': ['error', 'tab'],
					'@stylistic/jsx-curly-spacing': ['error', { when: 'never', children: true }],
					'@stylistic/jsx-tag-spacing': ['error', {
						closingSlash: 'never',
						beforeSelfClosing: 'always',
						afterOpening: 'never',
						beforeClosing: 'never',
					}],
					'@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
				},
			},
			{
				...reactHooks.configs.flat['recommended-latest'] as Linter.Config,
				name: 'bust/react-hooks',
			},
		);
	}

	if (withVitest) {
		configs.push({
			name: 'bust/vitest',
			files: ['**/*.test.{js,jsx,ts,tsx,mjs,mts}'],
			plugins: { vitest },
			rules: vitest.configs.recommended.rules as Linter.RulesRecord,
		});
	}

	return configs;
}

export default bust;
