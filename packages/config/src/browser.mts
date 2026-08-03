import { Config, CONFIG_GLOBAL_NAME } from './config.js';
import type { SettingsSchemaTree, ConfigEnvVars } from './types.js';

export { type SettingsSchemaTree, type ConfigEnvVars, Config, CONFIG_GLOBAL_NAME };


// NOTE: this must be the literal string `CONFIG_GLOBAL_NAME` resolves to in
// config.ts ('__BUST_CONFIG__') - bundlers' `define` replaces bare identifiers
// referenced like this via static text/AST matching, not a dynamic lookup, so
// it can't be written as `globalThis[CONFIG_GLOBAL_NAME]`.
declare const __BUST_CONFIG__: ConfigEnvVars | undefined;

/**
 * Reads the settings blob the end-user's bundler baked in via
 * `getBrowserDefine()` (see `node.ts`), falling back to an empty object when
 * it's unavailable (e.g. running un-bundled, or the consumer hasn't wired up
 * `define` yet) - in which case settings just fall back to their defaults.
 */
export function getBrowserEnv(): ConfigEnvVars {
	return typeof __BUST_CONFIG__ === 'undefined' ? {} : __BUST_CONFIG__;
}

/**
 * Builds a {@link Config} instance for use in the browser. Settings are
 * sourced from the `public: true` subset of a Node-side config, baked in
 * at build time via `getBrowserDefine()` and your bundler - this entry
 * point has no dependency on any Node.js-only API.
 *
 * @example
 * ```ts
 * // config.ts - construct the config once and export it for the rest of
 * // your app to import and share
 * import { createConfig } from '@bust/config';
 * import { schema } from './schema.js';
 *
 * export const config = createConfig(schema);
 * ```
 * ```ts
 * // elsewhere.ts
 * import { config } from './config.js';
 *
 * config.get('app.name');
 * ```
 *
 * See `getBrowserDefine()` in `node.ts` for the bundler side of this.
 */
export function createConfig(schema: SettingsSchemaTree): Config {
	return new Config({ schema, env: getBrowserEnv() });
}
