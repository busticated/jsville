import path from 'node:path';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';

export default tseslint.config(
	includeIgnoreFile(path.join(import.meta.dirname, '.gitignore')),
	{
		ignores: ['**/docs/**']
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2024,
			globals: {
				...globals['shared-node-browser'],
				...globals.commonjs,
				process: true
			}
		},
		rules: {
			'array-bracket-spacing': ['error', 'never'],
			'arrow-spacing': 'error',
			'block-scoped-var': 'error',
			'block-spacing': 'error',
			'brace-style': ['error', '1tbs'],
			'camelcase': ['error', {
				properties: 'never'
			}],
			'constructor-super': 'error',
			'curly': 'error',
			'eol-last': 'error',
			'eqeqeq': ['error', 'smart'],
			'func-names': ['error', 'as-needed'],
			'func-style': ['error', 'declaration', {
				allowArrowFunctions: true
			}],
			'indent': ['error', 'tab', {
				SwitchCase: 1,
				ObjectExpression: 'first',
				MemberExpression: 1,
				ignoredNodes: ['TemplateLiteral *']
			}],
			'keyword-spacing': ['error', {
				before: true,
				after: true,
			}],
			'max-depth': ['warn', 3],
			'max-len': ['error', {
				code: 120,
				ignoreComments: true,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true
			}],
			'max-statements': ['warn', 30],
			'new-cap': 'warn',
			'no-class-assign': 'error',
			'no-cond-assign': ['error', 'except-parens'],
			'no-console': 'error',
			'no-const-assign': 'error',
			'no-dupe-class-members': 'error',
			'no-extend-native': 'error',
			'no-extra-parens': ['error', 'functions'],
			'no-mixed-spaces-and-tabs': 'error',
			'no-multi-spaces': ['error', {
				exceptions: {
					VariableDeclarator: true,
				}
			}],
			'no-nested-ternary': 'error',
			'no-prototype-builtins': 'off',
			'no-this-before-super': 'error',
			'no-trailing-spaces': 'error',
			'no-undef': 'error',
			'no-underscore-dangle': 'off',
			'no-use-before-define': ['error', {
				functions: false,
				classes: false
			}],
			'no-whitespace-before-property': 'error',
			'no-var': 'error',
			'object-curly-spacing': ['error', 'always'],
			'prefer-const': 'error',
			'quotes': ['error', 'single', {
				avoidEscape: true,
				allowTemplateLiterals: true
			}],
			'semi': ['error', 'always'],
			'space-in-parens': ['error', 'never'],
			'space-infix-ops': 'error',
			'space-unary-ops': ['error', {
				words: true,
				nonwords: false
			}],
			'strict': ['error', 'global']
		}
	},
	{
		files: [
			'**/*.spec.js',
			'**/*.test.js',
			'**/*.e2e.js',
			'**/*.integration.js',
			'**/*.spec.ts',
			'**/*.test.ts',
			'**/*.e2e.ts',
			'**/*.integration.ts',
		],
		rules: {
			'func-names': 'off'
		}
	},
	{
		files: ['bin/lib/log.mjs'],
		rules: {
			'no-console': 'off'
		}
	}
);
