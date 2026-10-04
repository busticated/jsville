import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Linter } from 'eslint';
import type { Linter as LinterTypes } from 'eslint';
import { bust, DEFAULT_IGNORES } from './index.js';


describe('@bust/eslint-config', () => {
	describe('bust() default options', () => {
		it('Targets TypeScript, with type-aware rules and no framework blocks', () => {
			const names = namesOf(bust());
			assert.deepEqual(names, [
				'bust/ignores',
				'bust/base',
				'bust/typescript',
				'bust/type-aware',
			]);
		});

		it('Turns the project service on and roots it at the working directory', () => {
			const block = blockNamed(bust(), 'bust/type-aware');
			assert.deepEqual(block.files, ['**/*.{ts,tsx,mts,cts}']);
			assert.deepEqual(parserOptionsOf(block), {
				projectService: true,
				tsconfigRootDir: process.cwd(),
			});
		});

		it('Registers the TypeScript-aware variants of the shared rules', () => {
			const rules = rulesOf(blockNamed(bust(), 'bust/typescript'));
			assert.ok(rules['@typescript-eslint/no-unused-vars']);
			assert.ok(rules['@typescript-eslint/no-use-before-define']);
			assert.equal(rules['no-use-before-define'], 'off');
		});
	});

	describe('bust() ignores', () => {
		it('Ignores build output by default', () => {
			const block = blockNamed(bust(), 'bust/ignores');
			assert.deepEqual(block.ignores, DEFAULT_IGNORES);
		});

		it('Appends the paths a project passes in', () => {
			const block = blockNamed(bust({ ignores: ['.output/'] }), 'bust/ignores');
			assert.deepEqual(block.ignores, [...DEFAULT_IGNORES, '.output/']);
		});
	});

	describe('bust() for JavaScript-only projects', () => {
		it('Drops the TypeScript blocks and keeps the core rules', () => {
			const names = namesOf(bust({ typescript: false }));
			assert.deepEqual(names, ['bust/ignores', 'bust/base', 'bust/javascript']);
		});

		it('Falls back to the core `no-unused-vars` with the same options', () => {
			const rules = rulesOf(blockNamed(bust({ typescript: false }), 'bust/javascript'));
			assert.deepEqual(rules['no-unused-vars'], ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			}]);
		});

		it('Reports the shared rules against real source', () => {
			const messages = new Linter().verify(
				'var x = 1\n',
				bust({ typescript: false }) as LinterTypes.Config[],
				'example.js',
			);
			const ruleIds = messages.map((message) => message.ruleId).sort();
			assert.deepEqual(ruleIds, ['@stylistic/semi', 'no-unused-vars', 'no-var']);
		});
	});

	describe('bust() type-aware rules', () => {
		it('Can be turned off on their own', () => {
			const names = namesOf(bust({ typeAware: false }));
			assert.deepEqual(names, ['bust/ignores', 'bust/base', 'bust/typescript']);
		});

		it('Are skipped entirely for a JavaScript-only project', () => {
			const names = namesOf(bust({ typescript: false, typeAware: true }));
			assert.equal(names.includes('bust/type-aware'), false);
		});

		it('Carry the files a project type-checks outside its tsconfig', () => {
			const block = blockNamed(
				bust({ allowDefaultProject: ['eslint.config.js'] }),
				'bust/type-aware',
			);
			assert.deepEqual(parserOptionsOf(block).projectService, {
				allowDefaultProject: ['eslint.config.js'],
			});
		});

		it('Root the project service where the project says', () => {
			const block = blockNamed(bust({ tsconfigRootDir: '/somewhere' }), 'bust/type-aware');
			assert.equal(parserOptionsOf(block).tsconfigRootDir, '/somewhere');
		});
	});

	describe('bust() React', () => {
		it('Adds the react, jsx-stylistic, and hooks blocks', () => {
			const names = namesOf(bust({ react: true }));
			assert.equal(names.includes('bust/react'), true);
			assert.equal(names.includes('bust/react-stylistic'), true);
			assert.equal(names.includes('bust/react-hooks'), true);
		});

		it('Scopes the react blocks to jsx and tsx', () => {
			const block = blockNamed(bust({ react: true }), 'bust/react-stylistic');
			assert.deepEqual(block.files, ['**/*.{jsx,tsx}']);
		});

		it('Uses the plain react rules when there is no TypeScript', () => {
			const configs = bust({ typescript: false, react: true });
			const block = blockNamed(configs, 'bust/react');
			assert.ok(block.plugins);
		});
	});

	describe('bust() Node test runner', () => {
		it('Relaxes the type-aware rule its `describe()` and `it()` trip', () => {
			const block = blockNamed(bust({ nodeTest: true }), 'bust/node-test');
			assert.equal(rulesOf(block)['@typescript-eslint/no-floating-promises'], 'off');
		});

		it('Covers the spec, e2e, and integration suites too', () => {
			const block = blockNamed(bust({ nodeTest: true }), 'bust/node-test');
			assert.deepEqual(block.files, ['**/*.{spec,test,e2e,integration}.{js,jsx,ts,tsx,mjs,mts}']);
		});

		it('Is skipped when there are no type-aware rules to relax', () => {
			const names = namesOf(bust({ nodeTest: true, typeAware: false }));
			assert.equal(names.includes('bust/node-test'), false);
		});

		it('Is absent unless asked for', () => {
			assert.equal(namesOf(bust()).includes('bust/node-test'), false);
		});
	});

	describe('bust() Vitest', () => {
		it('Adds a block scoped to test files', () => {
			const block = blockNamed(bust({ vitest: true }), 'bust/vitest');
			assert.deepEqual(block.files, ['**/*.test.{js,jsx,ts,tsx,mjs,mts}']);
			assert.ok(block.rules);
		});

		it('Is absent unless asked for', () => {
			assert.equal(namesOf(bust()).includes('bust/vitest'), false);
		});
	});

	describe('bust() strict', () => {
		it('Is absent unless asked for', () => {
			assert.equal(namesOf(bust()).some((name) => name.startsWith('bust/strict')), false);
		});

		it('Adds no test blocks without a test runner', () => {
			const names = namesOf(bust({ strict: true }));
			assert.equal(names.at(-1), 'bust/strict');
			assert.equal(names.includes('bust/strict-tests'), false);
		});

		it('Puts variables and types above their users in TypeScript', () => {
			const rules = rulesOf(blockNamed(bust({ strict: true }), 'bust/strict'));
			assert.deepEqual(rules['@typescript-eslint/no-use-before-define'], ['error', {
				functions: false,
				classes: false,
				variables: true,
				typedefs: true,
				ignoreTypeReferences: false,
			}]);
		});

		it('Uses the core `no-use-before-define` without TypeScript', () => {
			const rules = rulesOf(blockNamed(bust({ typescript: false, strict: true }), 'bust/strict'));
			assert.deepEqual(rules['no-use-before-define'], ['error', {
				functions: false,
				classes: false,
				variables: true,
			}]);
		});

		it('Scopes the test rules to Vitest files and adds the Vitest-only rules', () => {
			const configs = bust({ strict: true, vitest: true });
			assert.deepEqual(blockNamed(configs, 'bust/strict-tests').files, ['**/*.test.{js,jsx,ts,tsx,mjs,mts}']);
			assert.ok(rulesOf(blockNamed(configs, 'bust/strict-vitest'))['vitest/require-top-level-describe']);
		});

		it('Scopes the test rules to the Node test runner suites without the Vitest-only rules', () => {
			const names = namesOf(bust({ strict: true, nodeTest: true }));
			const block = blockNamed(bust({ strict: true, nodeTest: true }), 'bust/strict-tests');
			assert.deepEqual(block.files, ['**/*.{spec,test,e2e,integration}.{js,jsx,ts,tsx,mjs,mts}']);
			assert.equal(names.includes('bust/strict-vitest'), false);
		});

		it('Reports a blank line after a single-line statement', () => {
			const ruleIds = verify('export function f() {\n\tconst a = 1;\n\n\treturn a;\n}\n', 'example.js');
			assert.deepEqual(ruleIds, ['@stylistic/padding-line-between-statements']);
		});

		it('Reports a primitive constant that is not SCREAMING_SNAKE_CASE', () => {
			const ruleIds = verify('export const maxTries = 3;\nexport const MAX_LENGTH = 10;\n', 'example.js');
			assert.deepEqual(ruleIds, ['no-restricted-syntax']);
		});

		it('Reports a describe() title that names neither the module nor a function', () => {
			const source = [
				"describe('@bust/example', () => {",
				"\tdescribe('example()', () => {});",
				'',
				"\tdescribe('guards', () => {});",
				'});',
				'',
			].join('\n');
			const messages = verifyMessages(source, 'example.test.js');
			assert.deepEqual(messages.map((message) => message.line), [4]);
		});

		function verify(source: string, filename: string): string[] {
			return verifyMessages(source, filename).map((message) => String(message.ruleId)).sort();
		}

		function verifyMessages(source: string, filename: string): LinterTypes.LintMessage[] {
			const configs = bust({ typescript: false, strict: true, nodeTest: true });
			return new Linter().verify(source, [...configs, { languageOptions: { globals: { describe: 'readonly' } } }] as LinterTypes.Config[], filename);
		}
	});

	// the plugin configs we compose carry their own names; these assertions are
	// about the blocks this package contributes
	function namesOf(configs: LinterTypes.Config[]): string[] {
		const names: string[] = [];

		for (const config of configs) {
			const name = String(config.name);

			if (name.startsWith('bust/')) {
				names.push(name);
			}
		}

		return names;
	}

	// these read blocks this package builds, so they skip the optional-chaining
	// fallbacks - unreachable branches cost branch coverage on node 22, which
	// counts test files where node 24 does not
	function parserOptionsOf(config: LinterTypes.Config): Record<string, unknown> {
		const { languageOptions } = config as { languageOptions: { parserOptions: Record<string, unknown> } };
		return languageOptions.parserOptions;
	}

	function rulesOf(config: LinterTypes.Config): Record<string, unknown> {
		return (config as { rules: Record<string, unknown> }).rules;
	}

	function blockNamed(configs: LinterTypes.Config[], name: string): LinterTypes.Config {
		const found = configs.find((config) => config.name === name);
		assert.ok(found, `expected a block named '${name}'`);
		return found;
	}
});
