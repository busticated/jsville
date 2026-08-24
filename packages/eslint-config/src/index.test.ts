import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Linter } from 'eslint';
import type { Linter as LinterTypes } from 'eslint';
import { bust, DEFAULT_IGNORES } from './index.js';


describe('@bust/eslint-config', () => {
	describe('Default options', () => {
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
			const rules = blockNamed(bust(), 'bust/typescript').rules ?? {};
			assert.ok(rules['@typescript-eslint/no-unused-vars']);
			assert.ok(rules['@typescript-eslint/no-use-before-define']);
			assert.equal(rules['no-use-before-define'], 'off');
		});
	});

	describe('Ignores', () => {
		it('Ignores build output by default', () => {
			const block = blockNamed(bust(), 'bust/ignores');
			assert.deepEqual(block.ignores, DEFAULT_IGNORES);
		});

		it('Appends the paths a project passes in', () => {
			const block = blockNamed(bust({ ignores: ['.output/'] }), 'bust/ignores');
			assert.deepEqual(block.ignores, [...DEFAULT_IGNORES, '.output/']);
		});
	});

	describe('JavaScript-only projects', () => {
		it('Drops the TypeScript blocks and keeps the core rules', () => {
			const names = namesOf(bust({ typescript: false }));
			assert.deepEqual(names, ['bust/ignores', 'bust/base', 'bust/javascript']);
		});

		it('Falls back to the core `no-unused-vars` with the same options', () => {
			const rules = blockNamed(bust({ typescript: false }), 'bust/javascript').rules ?? {};
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

	describe('Type-aware rules', () => {
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

	describe('React', () => {
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

	describe('Vitest', () => {
		it('Adds a block scoped to test files', () => {
			const block = blockNamed(bust({ vitest: true }), 'bust/vitest');
			assert.deepEqual(block.files, ['**/*.test.{js,jsx,ts,tsx,mjs,mts}']);
			assert.ok(block.rules);
		});

		it('Is absent unless asked for', () => {
			assert.equal(namesOf(bust()).includes('bust/vitest'), false);
		});
	});

	// the plugin configs we compose carry their own names; these assertions are
	// about the blocks this package contributes
	function namesOf(configs: LinterTypes.Config[]): string[] {
		return configs
			.map((config) => config.name)
			.filter((name): name is string => typeof name === 'string' && name.startsWith('bust/'));
	}

	function parserOptionsOf(config: LinterTypes.Config): Record<string, unknown> {
		return (config.languageOptions?.parserOptions ?? {}) as Record<string, unknown>;
	}

	function blockNamed(configs: LinterTypes.Config[], name: string): LinterTypes.Config {
		const found = configs.find((config) => config.name === name);
		assert.ok(found, `expected a block named '${name}'`);
		return found;
	}
});
