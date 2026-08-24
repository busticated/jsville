import { describe, it, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { SettingsValue } from './types.js';
import { Config, createConfig, getBrowserDefine, CONFIG_GLOBAL_NAME } from './node.js';


describe('@bust/config/node', () => {
	const schema = {
		app: {
			name: { default: 'My App', env: 'MY_APP_NAME', public: true },
			secret: { default: 'shh', env: 'MY_APP_SECRET' },
		},
	};

	describe('createConfig()', () => {
		it('Builds a config sourced from `process.env`', async () => {
			const config = createConfig(schema);
			assert.strictEqual(config.get('app.name'), 'My App');
		});
	});

	describe('Schema-derived types', () => {
		// an inline schema keeps its literal types - a `const` type parameter
		// only preserves them for the expression at the call site, so a schema
		// hoisted into its own variable needs `as const` to type its enums
		const typed = createConfig({
			app: {
				name: { default: 'My App', env: 'MY_APP_NAME' },
				env: { default: 'development', format: ['development', 'staging', 'production'] },
				url: { default: 'http://example.com', format: 'url' },
				port: { default: 3000, format: 'nat' },
				debug: { default: false },
				hosts: { default: [], format: 'array' },
				owners: { default: ['ada@example.com'], format: 'array' },
				pattern: { default: /^ok$/ },
				limits: { default: { max: 10 }, format: 'object' },
			},
		});

		it('Resolves each setting to the type its format implies', () => {
			const name: string = typed.get('app.name');
			const env: 'development' | 'staging' | 'production' = typed.get('app.env');
			const url: string = typed.get('app.url');
			const port: number = typed.get('app.port');
			const debug: boolean = typed.get('app.debug');
			const hosts: string[] = typed.get('app.hosts');
			const owners: string[] = typed.get('app.owners');
			const pattern: RegExp = typed.get('app.pattern');
			const limits: Record<string, unknown> = typed.get('app.limits');

			assert.strictEqual(name, 'My App');
			assert.strictEqual(env, 'development');
			assert.strictEqual(url, 'http://example.com');
			assert.strictEqual(port, 3000);
			assert.strictEqual(debug, false);
			assert.deepEqual(hosts, []);
			assert.deepEqual(owners, ['ada@example.com']);
			assert.deepEqual(pattern, /^ok$/);
			assert.deepEqual(limits, { max: 10 });
		});

		it('Rejects keys the schema does not declare', () => {
			// @ts-expect-error - 'app.nmae' is a typo, not a declared key
			assert.throws(() => typed.get('app.nmae'));
			// @ts-expect-error - 'app' is a branch, not a setting
			assert.throws(() => typed.get('app'));
		});

		it('Falls back to loose keys and values when the schema shape is unknown', () => {
			const loose: Config = new Config({ schema, env: {} });
			const value: SettingsValue = loose.get('app.name');

			assert.strictEqual(value, 'My App');
		});
	});

	describe('getBrowserDefine()', () => {
		it('Includes public settings in a bundler-friendly `define` object', async () => {
			const config = createConfig(schema);
			assert.deepEqual(getBrowserDefine(config), {
				[CONFIG_GLOBAL_NAME]: { MY_APP_NAME: 'My App' },
			});
		});
	});

	describe('.env file loading', () => {
		let cwd: string;
		let dir: string;

		before(() => {
			cwd = process.cwd();
			// TODO (busticated): retarget to local `./tmp` directory
			dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bust-config-'));
			fs.writeFileSync(path.join(dir, '.env'), 'MY_APP_NAME=Loaded From Dotenv\n');
			process.chdir(dir);
		});

		after(() => {
			process.chdir(cwd);
			fs.rmSync(dir, { recursive: true, force: true });
			delete process.env.MY_APP_NAME;
		});

		it('Loads values from a `.env` file before building the config', async () => {
			const mod = await import(`./node.js?bust-config-test=${Date.now()}`);
			const config = mod.createConfig(schema);
			assert.strictEqual(config.get('app.name'), 'Loaded From Dotenv');
			assert.deepEqual(mod.getBrowserDefine(config), {
				[mod.CONFIG_GLOBAL_NAME]: { MY_APP_NAME: 'Loaded From Dotenv' },
			});
		});
	});
});
