import { describe, it, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createConfig, getBrowserDefine, CONFIG_GLOBAL_NAME } from './node.js';


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
