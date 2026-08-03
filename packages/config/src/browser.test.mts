import { describe, it, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { createConfig, getBrowserEnv } from './browser.mjs';


// stand-in for the schema an end-user app would author for itself
const schema = {
	app: {
		name: { default: 'My App', env: 'MY_APP_NAME', public: true },
	},
};

type GlobalWithBustConfig = typeof globalThis & { __BUST_CONFIG__?: Record<string, unknown> };

describe('@bust/config/browser', () => {
	afterEach(() => {
		delete (globalThis as GlobalWithBustConfig).__BUST_CONFIG__;
	});

	describe('createConfig', () => {
		it('Builds a config sourced from its schema defaults when nothing was baked in', () => {
			const config = createConfig(schema);
			assert.strictEqual(config.get('app.name'), 'My App');
		});

		it('Builds a config sourced from a `getBrowserDefine()`-baked settings blob', () => {
			(globalThis as GlobalWithBustConfig).__BUST_CONFIG__ = { MY_APP_NAME: 'Baked In By Vite' };

			const config = createConfig(schema);
			assert.strictEqual(config.get('app.name'), 'Baked In By Vite');
		});
	});

	describe('getBrowserEnv', () => {
		it('Falls back to an empty object when nothing was baked in', () => {
			assert.deepEqual(getBrowserEnv(), {});
		});

		it('Returns the settings blob a bundler baked in via `define`', () => {
			(globalThis as GlobalWithBustConfig).__BUST_CONFIG__ = { MY_APP_NAME: 'Baked In By Vite' };

			assert.deepEqual(getBrowserEnv(), { MY_APP_NAME: 'Baked In By Vite' });
		});
	});
});
