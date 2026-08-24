import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import bust from '@bust/eslint-config';

export default [
	includeIgnoreFile(path.join(import.meta.dirname, '.gitignore')),

	...bust({ ignores: ['**/docs/**'] }),

	{
		name: 'jsville/tests',
		files: ['**/*.{spec,test,e2e,integration}.{js,mjs,ts,mts}'],
		rules: {
			'func-names': 'off',
			// `node:test`'s `describe()` and `it()` return promises nobody is
			// meant to await - the rule is right about the type and wrong about
			// this runner
			'@typescript-eslint/no-floating-promises': 'off',
		},
	},

	{
		name: 'jsville/prototype-builtins',
		rules: {
			'no-prototype-builtins': 'off',
		},
	},

	{
		name: 'jsville/logger',
		files: ['bin/lib/log.mjs'],
		rules: {
			'no-console': 'off',
		},
	},
];
