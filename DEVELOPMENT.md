# JSVille Development

[Installation](#installation) | [How-Tos & FAQs](#how-tos--faqs) | [Conventions](#conventions) | [Docs](#docs--resources) | [Releasing](#releasing)


## Installation

1. Install Node.js [`node@20.x` and `npm@10.x` are required]
2. Clone this repository `$ git clone git@github.com:busticated/jsville.git && cd ./jsville`
3. Install dependencies `$ npm install`
4. View available commands `$ npm run`
5. Run the tests `$ npm test`
6. Start Hacking!


## How-Tos & FAQs

The JSVille collection is managed using [NPM Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) and [Lerna](https://lernajs.io/). All essential commands are available at the root via `npm run <script name>` - e.g. `npm run lint`. To view the available commands, run: `npm run`


<details id="develop-create-package">
<summary><b>How to create a new package</b></summary>
<p>

To create a _new_ package, run `npm run package:create` and follow the prompts. Upon completion, your new package will be available within `./packages/<your package>`

</p>
</details>

<details id="develop-add-remove-package-deps">
<summary><b>How to add, remove, and update package dependencies</b></summary>
<p>

In general, aim to share `devDependencies` by installing them in the root using `npm i <module name> --save-dev` and uninstalling with `npm uninstall <module name>`.

For a package's _production_ dependencies, install with:

```shell
npm install <module-to-install> --workspace packages/<target-package>
```

e.g.

```shell
npm install cowsay --workspace packages/timer
```

...and uninstall with:

```shell
npm uninstall <module-to-install> --workspace packages/<target-package>
```

e.g.

```shell
npm uninstall cowsay --workspace packages/timer
```

> [!TIP]
> 💡 Add / update / remove dependencies in separate, dedicated commits so it's easier to track dependency changes and revert things later if need be.

> [!IMPORTANT]
> 🚨 Remember to include lock file (`npm-shrinkwrap.json`) changes, if any.

</p>
</details>

<details id="develop-outdated-packages">
<summary><b>How to check for outdated package dependencies</b></summary>
<p>

Simply run:

```shell
npm run outdated
```

This will output a list of outdated dependencies, if any. From there you can update as appropriate - see ["How to add, remove, and update package dependencies"](#user-content-develop-add-remove-package-deps)

</p>
</details>

<details id="develop-run-tests">
<summary><b>How to run your package's tests & see code coverage stats</b></summary>
<p>

To run _all_ tests for _all_ packages:

```shell
npm test
```

To run tests for _a specific_ package:

```shell
npm test -- --workspace packages/<target-package>
```

e.g.

```shell
npm test -- --workspace packages/timer
```

Run `npm run` to see other test-related commands, if available.

</p>
</details>

<details id="develop-run-lint_typecheck">
<summary><b>How to lint & typecheck your code</b></summary>
<p>

To run the type checker:

```
npm run typecheck
```

To run the linter:

```
npm run lint
```

To run the linter and automatically fix issues:

```
npm run lint -- --fix
```

Run `npm run` to see other lint and typecheck-related commands, if available.

</p>
</details>

<details id="develop-build-docs">
<summary><b>How to create docs</b></summary>
<p>

We use [TypeDoc](https://typedoc.org/) to generate source code documentation. Your code should be documented using the inline comments and tags listed [here](https://typedoc.org/guides/tags/).

Additionally, your package's `README.md` file should include html comment tags denoting the start and end of the API documentation section:

```html
<!-- api-docs-start -->
everything between these tags is replaced with a version-specific link to your package's `./docs` directory.
<!-- api-docs-end -->
```

Once you've added your inline documentation and prepared your README, run:

```
npm run docs:build -- --workspace packages/<your-package>
```

e.g.

```
npm run docs:build -- --workspace packages/timer
```

Docs will be generated and saved to your package's `./docs` directory.

To update docs for _all_ packages, run:

```
npm run docs:build
```

Run `npm run` to see other docs-related commands, if available.

</p>
</details>

<details id="develop-changelog">
<summary><b>How to format commits for changelogs</b></summary>
<p>

In order to support automated changelog updates, you will need to:

* Commit package changes separately - e.g. run: `git add -p packages/<name>/*` to stage files, then commit
* Format your commit message like: `[<package-name>] <message>` e.g. `[timer] update docs`
* Commit changes to the root package itself (anyting outside of the `./packages` directory) separately without prefixing your commit message

Each package has its own changelog ([example](packages/timer/CHANGELOG.md)). Upon releasing, each changelog will be updated with the changes made to that package since its last release.

To view unpublished changelog entries for all packages, run:

```
npm run changelog
```

Run `npm run` to see other changelog-related commands, if available.

</p>
</details>

<details id="develop-file-structure">
<summary><b>How to name and locate your package's files</b></summary>
<p>

Package files should follow a standard naming scheme and layout. Source files live within your package's `./src` directory. Test files live alongside their source files and are named like `*.test.ts`. All file and directory names are lowercase hyphen-separated (aka "kebab-case").

```
my-package
├── bin  <-- script files (installation helpers, release automation, etc)
│   └── ...
│
├── dist  <-- built source code
│   └── ...
│
├── docs  <-- generated documentation
│   └── ...
│
├── src  <-- source, tests, and supporting files
│   ├── __fixtures__  <-- test fixtures (utilities, data, etc)
│   │   ├── my-thing.json
│   │   ├── index.ts
│   │   └── ...
│   │
│   ├── index.ts
│   ├── index.test.ts
│   └── ...
│
├── tmp  <-- temporary files (coverage stats, test output, etc)
│   └── ...
│
├── CHANGELOG.md
├── README.md
└── ...
```

</p>
</details>

<details id="develop-npm-scripts">
<summary><b>How to name npm scripts</b></summary>
<p>

`npm` scripts are the primary means of executing programmatic tasks (e.g. tests, linting, releasing, etc) within the repo. to view available scripts, run `npm run`.

When creating a new script, be sure it does not already exist and use the following naming convention:

```
<category>:[<subcategory>]:[<action>]
```

Standard categories include: `test`, `lint`, `typecheck`, `build`, `clean`, `docs`, `package`, and `release`. `npm` itself includes special handling for `test` and `start` (doc: [1](https://docs.npmjs.com/cli/commands/npm-test), [2](https://docs.npmjs.com/cli/commands/npm-start)) amongst other [lifecycle scripts](https://docs.npmjs.com/cli/using-npm/scripts#life-cycle-scripts) - use these to expose key testing and start-up commands.

Sometimes your new script will be very similar to an existing script. in those cases, try to extend the existing script before adding another one.

</p>
</details>

<details id="develop-todo">
<summary><b>How to view and add TODO source code comments</b></summary>
<p>

To see what TODOs exist across the project, run:

```
npm run todo
```

When adding a TODO comment to your source code, format it like:

```js
// TODO (<name>): <message>
```

e.g.

```js
// TODO (busticated): this is my example todo comment
```

</p>
</details>

## Conventions

* [npm scripts](https://docs.npmjs.com/misc/scripts) form the _developer's API_ for the repo and all of its packages - key orchestration commands should be exposed here
* Document developer-facing process / tooling instructions in the [Development](#development) section
* Any package with unpublished changes will be published with the next release
* Plan to release your changes upon merging to `main` - refrain from merging if you cannot so you don't leave unpublished changes to others
* Commit package changes separately - e.g. run: `git add -p packages/<name>/*`, commit, then run `git add -p packages/<other-name>/*`, and commit
* Commit messages use a prefix formatted like `[<package directory name>] <message>` e.g. `[timer] update docs`
* Changes to the root package are committed separately and without prefixing the commit message
* All file and directory names are lowercase hyphen-separated (aka "kebab-case")
* Test files live alongside their source files and are named like `*.test.ts`
* Todo comments include your last name and are formatted like: `TODO (mirande): <message>`


## Docs & Resources

* [Node.js](https://nodejs.org/dist/latest-v20.x/docs/api/)
* [Typescript](https://www.typescriptlang.org)
* [tshy](https://github.com/isaacs/tshy)
* [NPM](https://docs.npmjs.com)
* [Lerna](https://lerna.js.org)
* [ESLint](https://eslint.org)


## Releasing

Packages are published from the `main` branch via CI/CD after peer review. To release packages with unpublished changes:

1. Make sure you have the latest:
	* `$ git checkout main`
	* `$ git pull`
2. Make sure tests pass
	* `$ npm test`
4. Run the release command; this will inspect all packages, determine what has changed, and prompt you for input.
	* `$ npm run release`
5. Follow the on-screen instructions, wait for confirmation of success
	* Brand-new package? want to bump the `rc`? select "Custom Prerelease" when prompted then accept the default to create: `1.0.0-rc.1`
6. Verify your release commit:
	* `$ git log -1`
	* Confirm the list of tags associated with the commit match the list of package versions in the message.
7. Push your tags:
	* `$ git push origin main --follow-tags`

> [!CAUTION]
> Avoid editing `git` history (`rebase`, etc) once the release commit is made - this will nullify the generated tags ([docs](https://git-scm.com/docs/git-tag#_on_re_tagging))_

