import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import bust from '@bust/eslint-config';

export default [
	includeIgnoreFile(path.join(import.meta.dirname, '.gitignore')),

	...bust({ nodeTest: true, ignores: ['**/docs/**'] }),

	{
		name: 'jsville/tests',
		files: ['**/*.{spec,test,e2e,integration}.{js,mjs,ts,mts}'],
		rules: {
			'func-names': 'off',
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
