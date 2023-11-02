## 2.0.0 / 2023-11-02
**NOTE:**<br>
⚠️ It's not valid anymore:<br>`const OSentry = require('oro-sentry')`,<br>
✔️ use the following instead:<br>`const { OSentry } = require('oro-sentry')`

* Refactored `./index.js` to `./src/index.ts`.
* Updated _package_ as `type: "module"`.
* Added `tsup` and now _package_ is compiled to `cjs` _(common)_ and `mjs` _(module)_.
* Added _github actions_:
    * `validate_pr_to_master`
    * `npm_publish_on_pr_merge_to_master`.
* Added `husky` (to ensure only valid commits).
* Added `eslint` (and applied it).
* Added `prettier` (and applied it).
* Updated _package description_
* Updated libs:
    * `@sentry/integrations` to `v7.77.0`.
    * `@sentry/node` to `v7.77.0`.
    * `oro-functions` to `v2.0.0`.
* Updated _dev_ libs:
    * `@babel/core` to `v7.23.2`.
    * `@babel/preset-env` to `v7.23.2`.
    * `@babel/preset-typescript` to `v7.23.2`.
    * `@types/jest` to `v29.5.7`.
    * `babel-jest` to `v29.7.0`.
    * `jest` to `v29.7.0`.
    * `sentry-testkit` to `v5.0.6`.

## 1.1.0 / 2023-08-14
* Added `TS` support.
* Added _ts tests_.
* Added `package-lock.json`.
* Improved _tests_.
* Improved _readme_.
* Added `LOG` in `static LEVEL`.
* Updated lib `oro-functions` to `v1.3.2`.
* Updated lib `@sentry/integrations` to `v7.63.0`.
* Updated lib `@sentry/node` to `v7.63.0`.
* Updated lib-dev `jest` to `v29.6.0`.
* Updated lib-dev `sentry-testkit` to `v5.0.5`.

## 1.0.0 / 2022-06-22
* Added `MIT License`.
* Added _unit testing_ `Jest`.
* Added _package_ in `github.com` & `npmjs.com`.
* Added _fns_ `status`, `environment`,  `getClient`, `getOptions`, improve security and performance.
* Updated lib `@sentry/integrations` to `v7.2.0`.
* Updated lib `@sentry/node` to `v7.2.0`.
* Updated lib `oro-functions` to `v1.1.7`.

## 0.1.0 / 2021-12-13
* Refactorized _OSentry_, removing `elk` and now it only has `sendResponse`, `captureMessage`.
* Updated lib `@sentry/integrations` to _v6.16.1_.
* Updated lib `@sentry/node` to _v6.16.1_.
* Updated lib `oro-functions` to _v1.0.2_.

## 0.0.7 / 2021-08-24
* Updated npm `oro-functions` to _v1.0.0_.

## 0.0.6 / 2021-05-17
* Fixed _Readme.md_ information.

## 0.0.5 / 2021-04-29
* Add _tagKey_ `task`.

## 0.0.4 / 2021-03-29
* Fix second optional param `inConsole:boolean = false` instead of `console`.

## 0.0.3 / 2021-03-25
* Added second optional param `console:boolean = false` when `send...` or `log...`.

## 0.0.2 / 2021-03-24
* Added changelog.
* Added tag `projectserver` (like `projectname`).
* Updated npm `oro-functions`.
