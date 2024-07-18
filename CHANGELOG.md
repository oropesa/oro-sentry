## 2.1.0 / 2024-07-18

- Re-init `package-lock.json`.
- Added _coverage_ for testing.
- Added _watcher_ for coding.
- Updated _eslint_ to flat `eslint.config.js`.
- Fixed `let` by `const` when it's required.
- Fixed _github cicd_ workflow jobs.
- Improved _github cicd_ replacing `actions/--@v3` by `actions/--@v4`, and replacing `npm install` to `npm ci`.
- Improved `export` declarations in index files.
- Enhanced _linter_ adding some extensions.
- Enhanced _prettier_ adding import-sorter.
- Simplified `tsup.config.ts`.
- Moved _tests_ inside `src` and simplified `*.test.js` to have only the _special-js_ cases.
- Enhanced testing to achieve over `97%` of coverage (yay!).
- Updated libs:
  - `@sentry/integrations` from `v7.77.0` to `v7.114.0`.
  - `@sentry/node` from `v7.77.0` to `v8.18.0`.
  - `oro-functions-client` from `v2.0.0` to `v2.3.1`.
- Added _dev_ libs:
  - `@eslint/js`
  - `@trivago/prettier-plugin-sort-imports`
  - `eslint-config-prettier`
  - `eslint-plugin-jest`
  - `globals`
  - `nodemon`
  - `typescript-eslint`
- Updated _dev_ libs:
  - `@babel/core` from `v7.23.2` to `v7.24.9`.
  - `@babel/preset-env` from `v7.23.2` to `v7.24.8`.
  - `@babel/preset-typescript` from `v7.23.2` to `v7.24.7`.
  - `@types/jest` from `v29.5.7` to `v29.5.12`.
  - `eslint` from `v8.52.0` to `v^8.57.0`.
  - `eslint-plugin-unicorn` from `v49.0.0` to `v54.0.0`.
  - `husky` from `v8.0.3` to `v9.0.11`.
  - `prettier` from `v3.0.1` to `v3.3.3`.
  - `sentry-testkit` from `v5.0.6` to `v5.0.9`.
  - `tsup` from `v7.2.0` to `v8.1.0`.
  - `typescript` from `v5.2.2` to `v5.5.3`.
- Removed _dev_ libs:
  - `@typescript-eslint/eslint-plugin` removed.
  - `@typescript-eslint/parser` removed.
  - `eslint-config-alloy` removed.
  - `eslint-plugin-jest-formatting` removed.

## 2.0.1 / 2023-11-02

- Fixed _CodeQL_: Incomplete string escaping or encoding `.replace(/\n/, ' ')`.

## 2.0.0 / 2023-11-02

**NOTE:**<br>
⚠️ It's not valid anymore:<br>`const OSentry = require('oro-sentry')`,<br>
✔️ use the following instead:<br>`const { OSentry } = require('oro-sentry')`

- Refactored `./index.js` to `./src/index.ts`.
- Updated _package_ as `type: "module"`.
- Added `tsup` and now _package_ is compiled to `cjs` _(common)_ and `mjs` _(module)_.
- Added _github actions_:
  - `validate_pr_to_master`
  - `npm_publish_on_pr_merge_to_master`.
- Added `husky` (to ensure only valid commits).
- Added `eslint` (and applied it).
- Added `prettier` (and applied it).
- Updated _package description_
- Updated libs:
  - `@sentry/integrations` to `v7.77.0`.
  - `@sentry/node` to `v7.77.0`.
  - `oro-functions` to `v2.0.0`.
- Updated _dev_ libs:
  - `@babel/core` to `v7.23.2`.
  - `@babel/preset-env` to `v7.23.2`.
  - `@babel/preset-typescript` to `v7.23.2`.
  - `@types/jest` to `v29.5.7`.
  - `babel-jest` to `v29.7.0`.
  - `jest` to `v29.7.0`.
  - `sentry-testkit` to `v5.0.6`.

## 1.1.0 / 2023-08-14

- Added `TS` support.
- Added _ts tests_.
- Added `package-lock.json`.
- Improved _tests_.
- Improved _readme_.
- Added `LOG` in `static LEVEL`.
- Updated lib `oro-functions` to `v1.3.2`.
- Updated lib `@sentry/integrations` to `v7.63.0`.
- Updated lib `@sentry/node` to `v7.63.0`.
- Updated lib-dev `jest` to `v29.6.0`.
- Updated lib-dev `sentry-testkit` to `v5.0.5`.

## 1.0.0 / 2022-06-22

- Added `MIT License`.
- Added _unit testing_ `Jest`.
- Added _package_ in `github.com` & `npmjs.com`.
- Added _fns_ `status`, `environment`, `getClient`, `getOptions`, improve security and performance.
- Updated lib `@sentry/integrations` to `v7.2.0`.
- Updated lib `@sentry/node` to `v7.2.0`.
- Updated lib `oro-functions` to `v1.1.7`.

## 0.1.0 / 2021-12-13

- Refactorized _OSentry_, removing `elk` and now it only has `sendResponse`, `captureMessage`.
- Updated lib `@sentry/integrations` to _v6.16.1_.
- Updated lib `@sentry/node` to _v6.16.1_.
- Updated lib `oro-functions` to _v1.0.2_.

## 0.0.7 / 2021-08-24

- Updated npm `oro-functions` to _v1.0.0_.

## 0.0.6 / 2021-05-17

- Fixed _Readme.md_ information.

## 0.0.5 / 2021-04-29

- Add _tagKey_ `task`.

## 0.0.4 / 2021-03-29

- Fix second optional param `inConsole:boolean = false` instead of `console`.

## 0.0.3 / 2021-03-25

- Added second optional param `console:boolean = false` when `send...` or `log...`.

## 0.0.2 / 2021-03-24

- Added changelog.
- Added tag `projectserver` (like `projectname`).
- Updated npm `oro-functions`.
