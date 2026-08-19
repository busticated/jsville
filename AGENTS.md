# AGENTS.md

Instructions for AI coding agents working on this repository. See [README.md](README.md) for what this project is and which packages it contains, and [DEVELOPMENT.md](DEVELOPMENT.md) for setup, conventions (naming, patterns, file organization, etc.), and available commands. If this document conflicts with the DEVELOPMENT doc, the DEVELOPMENT doc takes precedence. Prompt the user to update this document should it appear out of date.

Cross-references quote the target section's title exactly as it appears in the linked file — if a link fragment does not resolve, search for the quoted title. Preserve that exact match when adding or editing links.

---

## Hard rules — require explicit approval

- **Never** guess on a decision that is hard to undo — package names or ids, file locations, or new dependencies. Ask.
- **Never** run `npm install` or `npm update`. Ask; the user must say yes explicitly. Do not infer approval from a request to implement a feature that needs a dependency.
- **Never** `git commit`. Make changes locally, then prompt the user to review and commit.
- **Never** `git push`. Prompt the user, and explain why the push is needed.
- **Never** publish a package. See "[Releasing](DEVELOPMENT.md#releasing)".

---

## Environment setup

- Local development uses **Node.js v24** (see [.nvmrc](.nvmrc)). Published packages support **all active LTS lines** (see `engines` in [package.json](package.json)); CI tests against each of them, so a passing run on an older LTS is expected, not a warning sign.
- To learn how to install for development, see the DEVELOPMENT doc's "[Installation](DEVELOPMENT.md#installation)" section.
- **Always** run local development commands from the **project root**.

---

## Dependencies

- Installing or updating dependencies requires explicit approval — see "Hard rules" above.
- Shared **devDependencies** are installed at the **root**: `npm i <module> --save-dev`
- A package's **production** dependencies are installed against that workspace: `npm install <module> --workspace packages/<target-package>`
- Dependency changes go in their own dedicated commit, and must include the resulting `npm-shrinkwrap.json` changes.
- For the full procedure, see the DEVELOPMENT doc's "[How to add, remove, and update package dependencies](DEVELOPMENT.md#develop-add-remove-package-deps)" section.

---

## Local development commands

- All local development commands are implemented as **`npm` scripts**. See [package.json](package.json) and the DEVELOPMENT doc's "[How-Tos & FAQs](DEVELOPMENT.md#how-tos--faqs)" section for what is available.
- Follow the DEVELOPMENT doc's "[How to name npm scripts](DEVELOPMENT.md#develop-npm-scripts)" section when creating new `npm` scripts.
- **Always** use the existing `npm` script for a documented task — `test`, `lint`, `typecheck`, `build`, `docs:build`, and so on. The underlying tools can be invoked directly, but the scripts encode setup the raw command does not (build steps, coverage thresholds, workspace fan-out), so calling the tool yourself produces failures that take far more context to interpret. If a task has no script, ask before reaching for the underlying tool.
- New packages are scaffolded with `npm run package:create` — never hand-rolled. The script prompts for a name and description, generates the full package layout, then runs `npm install`, creates a `[<name>] create package` commit, and tags it. Those last three fall under "Hard rules" above, and the prompts require a human, so **ask the user to run it** rather than running it yourself. See the DEVELOPMENT doc's "[How to create a new package](DEVELOPMENT.md#develop-create-package)" section.

---

## Generated files

These are produced by tooling and overwritten on the next run — change the source or the generator, never the output. Most are committed, so they look hand-written:

- `<package>/docs/` — TypeDoc output (`npm run docs:build`). Edit the TSDoc comments in `src/` instead.
- The `<!-- api-docs-start -->` … `<!-- api-docs-end -->` block in each package's `README.md` — written by `bin/update-package-readme.mjs`.
- The `<!-- pkg-list-start -->` … `<!-- pkg-list-end -->` block in the root [README.md](README.md) — written by `bin/update-readme.mjs`.
- `<package>/CHANGELOG.md` — entries are generated at release time from commit messages; the `<!-- next-version-start -->` markers are the insertion point.
- `<package>/.tshy/` and the `exports`, `main`, and `types` fields in each `package.json` — managed by [tshy](https://github.com/isaacs/tshy). To change entry points, edit the `tshy.exports` field.
- `<package>/dist/` — build output (git-ignored).
- `npm-shrinkwrap.json` — updated by `npm`. Commit the changes it produces; don't hand-edit it.

---

## Source Control

- **Always** suggest a commit message when prompting the user to review and commit changes.
- Commit **one package per commit**, prefixed with that package's **directory name** — `[timer] update docs`. Changes outside `./packages` are committed separately, with no prefix.
- The prefix is load-bearing: changelog generation finds a package's changes by grepping commit subjects for `[<directory name>]`, so an unprefixed or mis-prefixed commit ships with no changelog entry.
- Commit messages must strictly follow the format specified in the [DEVELOPMENT](DEVELOPMENT.md) doc's "[How to format commits for changelogs](DEVELOPMENT.md#develop-changelog)" section.

---

## Code style

The [DEVELOPMENT](DEVELOPMENT.md) doc is authoritative for the topics below — see "[How to name and locate your package's files](DEVELOPMENT.md#develop-file-structure)" and "[How to work with modules](DEVELOPMENT.md#develop-modules)". Summarized here because they apply to nearly every change; consult the [DEVELOPMENT](DEVELOPMENT.md) doc when this summary is not enough, and treat it as correct if the two disagree.

**File naming and placement.** All packages live in `packages/`, all local development scripts live in `bin/`.

- All file and directory names are **kebab-case** — lowercase, hyphen-separated.
- Unit tests sit **beside their source** as `*.test.(ts|mts)`, where `.test.<ext>` is preceded by the source file's full name less its extension — `example.server.ts` is covered by `example.server.test.ts`. End-to-end tests follow unit test naming rules but use the `.e2e.<ext>` filename format and do not have a corresponding source file.
- `<package>/src/` for package source code, `<package>/docs/` for generated documentation.

**Modules.** ES Module syntax exclusively, imports ordered: bare/side-effect first, then third-party, then first-party. Within that order, `type`-only imports come above non-type ones, and every `type` import is marked as such. First-party imports **always include the file extension**, and it's the *emitted* extension — `.js` for a `.ts` source, `.mjs` for `.mts`. Non-type circular imports are never allowed.

The example below is illustrative — it shows one of each import form in order, using module names that aren't in this repo.

```
import 'some-package/setup.js';
import type { Widget } from 'some-package';
import { createWidget, type WidgetOptions } from 'other-package';
import type { ThingConfig } from './types.js';
import { Thing, type ThingOptions } from './thing.js';
import { formatLabel } from './lib/format.js';
```

**Comments.**

- All exported members and types are documented using JSDoc / TSDoc style code comments.
- Keep comments minimal and free of unnecessary commentary — capture the key details as concisely as possible.
- Todo comments are formatted like `TODO (busticated): <message>`, using the handle of the person the work is for. `npm run todo` lists every TODO in the repo, regardless of format.

---

## Testing

- For test file naming, location, snapshot conventions, and available test commands, see the [DEVELOPMENT](DEVELOPMENT.md) doc's "[How-Tos & FAQs](DEVELOPMENT.md#how-tos--faqs)" section.
- **Tests must not use conditionals** outside of setup and teardown hooks. Conditionals in test bodies can make tests flaky or hard to reason about; keep branching only in setup/teardown and only if absolutely necessary.
- Tests run against **built output**, not source: each package's `test:unit` runs `npm run build` first, then executes `dist/esm/*.test.js`. Source maps are enabled, so failures still point back to `src/`.
- To narrow a run to one package: `npm test -- --workspace packages/<target-package>`. This scopes only the unit tests; `lint` and `typecheck` still run across the whole repo.
- Always check your work before prompting the user to review and commit. Run both, and report the results honestly:

  ```
  npm test          # lint + typecheck + unit tests with coverage
  npm run test:e2e  # end-to-end tests
  ```

---

## Publishing

- To publish one or more packages, see the [DEVELOPMENT](DEVELOPMENT.md) doc's "[Releasing](DEVELOPMENT.md#releasing)" section.
