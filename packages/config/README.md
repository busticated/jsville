# `@bust/config`

Schema-driven configuration management for Node.js or the browser


## Installation

```shell
npm install @bust/config --save
```


## Usage

The heart of `@bust/config` is a schema that you define for your application. With this in place, `@bust/config` can read relevant variables from the environment, coerce them to the correct type, validate them, and provide a consistent interface for accessing them.

Here's how you get started:

```ts
// config.ts
import { createConfig } from '@bust/config';

export const config = createConfig({
	app: {
		name: { default: 'My App', env: 'MY_APP_NAME', public: true },
		secret: { default: '', env: 'MY_APP_SECRET' },
	},
});
```

Then simply `import` your config instance wherever you need it.

```ts
// elsewhere.ts
import { config } from './config.ts';

config.get('app.name');
```

`@bust/config` works in both Node.js and the browser by leveraging import maps defined in its `package.json` file. Bundlers
that respect the `browser` condition (Vite, webpack, Rollup, etc.) automatically get a browser-safe build with no Node.js-only dependencies.

Within a Node.js context, environment variables are loaded from a `.env` file courtesy of the [`dotenv`](https://github.com/motdotla/dotenv) library.


### Exposing settings to the browser

The browser receives your _public_ settings (marked `public: true` in your schema) via a global variable injected by your bundler. Here's how to set that up using `vite`:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { getBrowserDefine } from '@bust/config';
import { config } from './config.ts'; // as shown above

export default defineConfig({
	define: getBrowserDefine(config),
});
```

> [!CAUTION]
> Secrets should _NEVER_ be included in your schema. Instead, assign safe default / placeholder values then include the actual values in your `.env` file or directly in the environment.


## API
<!-- api-docs-start -->
see [here](https://github.com/busticated/jsville/tree/%40bust%2Fconfig%400.2.0/packages/config/docs)
<!-- api-docs-end -->

_NOTE: When in doubt, check usage in the [tests](./src/config.test.ts)_


## License

_See [LICENSE.md](./LICENSE.md)_
