import { describe, it, before } from 'node:test';
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';


// dist/esm/lib.e2e.js -> packages/config
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const tmpRoot = path.join(packageRoot, 'tmp');


describe('@bust/config end-to-end usage', () => {
	describe('Node.js', () => {
		const dir = path.join(tmpRoot, 'e2e-node');

		before(() => {
			writeFixture(dir, {
				'.env': 'MY_APP_NAME=E2E Node Value\n',
				'main.mjs': `
					import { createConfig } from '@bust/config';

					const config = createConfig({
						app: { name: { default: 'Default App', env: 'MY_APP_NAME', public: true } },
					});

					console.log(JSON.stringify({ name: config.get('app.name') }));
				`,
			});
		});

		it('Resolves the Node build via the real package specifier and loads a local `.env` file', () => {
			const stdout = execFileSync(process.execPath, ['main.mjs'], { cwd: dir, encoding: 'utf8' });
			assert.deepEqual(JSON.parse(stdout), { name: 'E2E Node Value' });
		});
	});

	describe('Browser (via Vite)', () => {
		const MY_APP_NAME = 'E2E Browser Test';
		const MY_APP_SECRET = 'fake-secret-value';
		const dir = path.join(tmpRoot, 'e2e-browser');
		const bundlePath = path.join(dir, 'dist', 'bundle.js');

		before(async () => {
			const cwd = process.cwd();

			writeFixture(dir, {
				'package.json': JSON.stringify({ name: 'e2e-browser-fixture', private: true, type: 'module' }),
				'.env': `MY_APP_NAME=${MY_APP_NAME}\nMY_APP_SECRET=${MY_APP_SECRET}\n`,
				'schema.mjs': `
					export const schema = {
						app: {
							name: { default: 'Default App', env: 'MY_APP_NAME', public: true },
							secret: { default: '', env: 'MY_APP_SECRET' },
						},
					};
				`,
				'main.mjs': `
					import { createConfig } from '@bust/config';
					import { schema } from './schema.mjs';

					const config = createConfig(schema);

					console.log(JSON.stringify({
						name: config.get('app.name'),
						secret: config.get('app.secret'),
					}));
				`,
				'vite.config.mjs': `
					import { defineConfig } from 'vite';
					import { createConfig, getBrowserDefine } from '@bust/config';
					import { schema } from './schema.mjs';

					const config = createConfig(schema);

					export default defineConfig({
						define: getBrowserDefine(config),
						build: {
							outDir: 'dist',
							lib: {
								entry: './main.mjs',
								formats: ['es'],
								fileName: () => 'bundle.js',
							},
						},
					});
				`,
			});

			process.chdir(dir);

			try {
				await build({ root: dir, logLevel: 'silent' });
			} finally {
				process.chdir(cwd);
			}
		});

		it('Bundles the browser-safe build with no dotenv/fs dependency', () => {
			const bundle = fs.readFileSync(bundlePath, 'utf8');
			assert.equal(bundle.includes('dotenv'), false);
			assert.equal(bundle.includes(MY_APP_SECRET), false);
		});

		it('Bakes in only `public: true` settings, leaving the rest at their defaults', () => {
			const stdout = execFileSync(process.execPath, [bundlePath], { encoding: 'utf8' });
			assert.deepEqual(JSON.parse(stdout), {
				name: MY_APP_NAME,
				secret: '',
			});
		});
	});
});

function writeFixture(dir: string, files: Record<string, string>): void {
	fs.rmSync(dir, { recursive: true, force: true });
	fs.mkdirSync(dir, { recursive: true });

	for (const [name, content] of Object.entries(files)) {
		fs.writeFileSync(path.join(dir, name), content);
	}
}
