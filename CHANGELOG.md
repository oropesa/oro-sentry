## 2.1.4 / 2025-10-22
- Add `update-deps.js` script.
- Update _github-workflows_ with `actions/checkout@v5` and `node-version: 22`.
- Update libs:
    - `@sentry/node` from `v9.5.0` to `v10.21.0`.
    - `oro-functions-client` from `v2.3.5` to `v2.3.6`.
- Update _dev_ libs:
    - `@babel/core` from `v7.26.9` to `v7.28.4`.
    - `@babel/preset-env` from `v7.26.9` to `v7.28.3`.
    - `@babel/preset-typescript` from `v7.26.0` to `v7.27.1`.
    - `@eslint/js` from `v9.22.0` to `v9.38.0`.
    - `@types/jest` from `v29.5.14` to `v30.0.0`.
    - `babel-jest` from `v29.7.0` to `v30.2.0`.
    - `eslint` from `v9.22.0` to `v9.38.0`.
    - `eslint-config-prettier` from `v10.1.1` to `v10.1.8`.
    - `eslint-plugin-jest` from `v28.11.0` to `v29.0.1`.
    - `eslint-plugin-prettier` from `v5.2.3` to `v5.5.4`.
    - `eslint-plugin-unicorn` from `v57.0.0` to `v61.0.2`.
    - `globals` from `v16.0.0` to `v16.4.0`.
    - `jest` from `v29.7.0` to `v30.2.0`.
    - `nodemon` from `v3.1.9` to `v3.1.10`.
    - `prettier` from `v3.5.3` to `v3.6.2`.
    - `sentry-testkit` from `v6.1.0` to `v6.2.2`.
    - `tsup` from `v8.4.0` to `v8.5.0`.
    - `typescript` from `v5.8.2` to `v5.9.3`.
    - `typescript-eslint` from `v8.26.0` to `v8.46.2`.
    - `wait-for-expect` from `v3.0.2` to `v4.0.0`.

## 2.1.3 / 2025-03-08

- Reset `package-lock.json`.
- Enhance `tsconfig.json`.
- Enhance _package_ `clean` and `build` scripts.
- Update libs:
  - `@sentry/node` from `v8.45.0` to `v9.5.0`.
  - `oro-functions-client` from `v2.3.4` to `v2.3.5`.
- Update _dev_ libs:
  - `@babel/core` from `v7.26.0` to `v7.26.9`.
  - `@babel/preset-env` from `v7.26.0` to `v7.26.9`.
  - `@eslint/js` from `v9.17.0` to `v9.22.0`.
  - `@trivago/prettier-plugin-sort-imports` from `v5.2.0` to `v5.2.2`.
  - `eslint` from `v9.17.0` to `v9.22.0`.
  - `eslint-config-prettier` from `v9.1.0` to `v10.1.1`.
  - `eslint-plugin-jest` from `v28.9.0` to `v28.11.0`.
  - `eslint-plugin-prettier` from `v5.2.1` to `v5.2.3`.
  - `eslint-plugin-unicorn` from `v56.0.1` to `v57.0.0`.
  - `globals` from `v15.13.0` to `v16.0.0`.
  - `prettier` from `v3.4.2` to `v3.5.3`.
  - `sentry-testkit` from `v5.0.9` to `v6.1.0`.
  - `tsup` from `v8.3.5` to `v8.4.0`.
  - `typescript` from `v5.7.2` to `v5.8.2`.
  - `typescript-eslint` from `v8.18.0` to `v8.26.0`.

## 2.1.2 / 2024-12-14

- Improve `eslint.config.js`.
- Remove _dev_ libs:
  - `eslint-plugin-jest-formatting` (non-used).
- Add _dev_ libs:
  - `eslint-plugin-jest-dom` added `v5.5.0`.
  - `eslint-plugin-prettier` added `v5.2.1`.
- Update _dev_ libs:
  - `@babel/core` from `v7.25.2` to `v7.26.0`.
  - `@babel/preset-env` from `v7.25.4` to `v7.26.0`.
  - `@babel/preset-typescript` from `v7.24.7` to `v7.26.0`.
  - `@eslint/js` from `v9.11.1` to `v9.16.0`.
  - `@trivago/prettier-plugin-sort-imports` from `v4.3.0` to `v5.2.0`.
  - `@types/jest` from `v29.5.13` to `v29.5.14`.
  - `eslint` from `v9.11.1` to `v9.16.0`.
  - `eslint-plugin-jest` from `v28.8.3` to `v28.9.0`.
  - `eslint-plugin-unicorn` from `v55.0.0` to `v56.0.1`.
  - `globals` from `v15.9.0` to `v15.13.0`.
  - `husky` from `v9.1.6` to `v9.1.7`.
  - `nodemon` from `v3.1.7` to `v3.1.9`.
  - `prettier` from `v3.3.3` to `v3.4.2`.
  - `tsup` from `v8.3.0` to `v8.3.5`.
  - `typescript` from `v5.5.4` to `v5.7.2`.
  - `typescript-eslint` from `v8.7.0` to `v8.18.0`.

## 2.1.1 / 2024-09-24

- Apply `prettier --write` in the whole project (with `endOfLine: 'lf'`).
- Fix eslint `@typescript-eslint/no-unused-expressions` rule in code.
- Update `eslint` _breakpoint version_ (v8 to v9).
- Update typescript _target_ to `ES2020`.
- Updated libs:
  - `@sentry/node` from `v8.18.0` to `v8.31.0`.
  - `oro-functions-client` from `v2.3.1` to `v2.3.2`.
- Updated _dev_ libs:
  - `@babel/core` from `v7.24.9` to `v7.25.2`.
  - `@babel/preset-env` from `v7.24.8` to `v7.25.4`.
  - `@eslint/js` from `v9.7.0` to `v9.11.1`.
  - `@types/jest` from `v29.5.12` to `v29.5.13`.
  - `eslint` from `v8.57.0` to `v9.11.1`.
  - `eslint-plugin-jest` from `v28.6.0` to `v28.8.3`.
  - `eslint-plugin-unicorn` from `v54.0.0` to `v55.0.0`.
  - `globals` from `v15.8.0` to `v15.9.0`.
  - `husky` from `v9.0.11` to `v9.1.6`.
  - `nodemon` from `v3.1.4` to `v3.1.7`.
  - `tsup` from `v8.1.0` to `v8.3.0`.
  - `typescript` from `v5.5.3` to `v5.5.4`.
  - `typescript-eslint` from `v7.16.1` to `v8.7.0`.

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
