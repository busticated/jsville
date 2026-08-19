import dotenv from 'dotenv';
import type { SettingsSchemaTree, ConfigEnvVars } from './types.js';
import { Config, CONFIG_GLOBAL_NAME } from './config.js';

export { type SettingsSchemaTree, type ConfigEnvVars, Config, CONFIG_GLOBAL_NAME };


dotenv.config({ quiet: true }); // silence log spam / ads from dotenv v17 | https://github.com/motdotla/dotenv/issues/876

/**
 * Builds a {@link Config} for use in Node.js: a local `.env` file (if
 * present in the current working directory) is loaded into `process.env`
 * before `schema` is hydrated, so local development values can live in a
 * git-ignored `.env` file instead of real environment variables.
 *
 * @example
 * ```ts
 * // config.ts - construct the config once and export it for the rest of
 * // your application to import and share
 * import { createConfig } from '@bust/config';
 *
 * export const config = createConfig({
 * 	app: {
 * 		name: { default: 'My App', env: 'MY_APP_NAME', public: true },
 * 		secret: { default: '', env: 'MY_APP_SECRET' },
 * 	},
 * });
 * ```
 * ```ts
 * // elsewhere.ts
 * import { config } from './config.ts';
 *
 * config.get('app.name');
 * ```
 */
export function createConfig(schema: SettingsSchemaTree): Config {
	return new Config({ schema, env: process.env });
}

/**
 * Produces a Vite `define` entry that exposes only `config`'s `public: true`
 * settings to a browser build - `createConfig()` in the browser reads this
 * same blob back out at runtime via {@link CONFIG_GLOBAL_NAME}. Values never
 * leave the Node process beyond what `getPublicEnvVars()` already returns, so
 * there's no separate `VITE_`-prefixed env var to keep in sync with `schema`.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { getBrowserDefine } from '@bust/config';
 * import { config } from './config.ts';
 *
 * export default defineConfig({
 * 	define: getBrowserDefine(config),
 * });
 * ```
 */
export function getBrowserDefine(config: Config): Record<string, ConfigEnvVars> {
	return { [CONFIG_GLOBAL_NAME]: config.getPublicEnvVars() };
}
