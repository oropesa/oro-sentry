# Oro Sentry

- [Overview](#overview)
- [Installation](#installation)
- [Example](#example)
- [Methods](#methods)

## Overview

**OSentry** class is a wrapper for [@sentry/node](https://www.npmjs.com/package/@sentry/node)
that allows you to use Sentry and send _custom_ events.

## Installation

```shell
npm install oro-sentry
```

## Example:

```js
// cjs
const { OSentry } = require( 'oro-sentry' );

// mjs, ts
import OSentry from 'oro-sentry';

const osentry = new OSentry( {
  projectname: 'testing',
  projectserver: 'ubuntu32',
  environment: 'DEVELOPMENT',
  sentryDsn: 'https://...'
  //or dsn: 'https://...'
});

// EXAMPLE 1

const response = osentry.sendResponse( { status: false, error: { msg: 'example', trackError: 777 } } );
// or
const response = osentry.sendResponse( Ofn.setResponseKO( 'example', { trackError: 777 } ) );

console.log( response );
//  {
//    status: true,
//    event: {
//      event_id: 'e11c1d4012a146c2b1384945a21d462c',
//      message: 'example',
//      captureContext: {
//        level: 'error',
//        tags: { projectname: 'testing', projectserver: 'ubuntu32' },
//        extra: { trackError: 777 }
//      }
//    }
//  }

// EXAMPLE 2

const response = osentry.sendResponse( { status: true, msg: 'example 2', level: 'debug' } );
// or
const response = osentry.sendResponse( Ofn.setResponseOK( 'example 2', { level: OSentry.LEVEL.DEBUG } ) );

console.log( response );
//  {
//    status: true,
//    event: {
//      event_id: 'e11c1d4012a146c2b1384945a21d462c',
//      message: 'example 2',
//      captureContext: {
//        level: 'debug',
//        tags: { projectname: 'testing', projectserver: 'ubuntu32' }
//      }
//    }
//  }
```

## Methods

- [new OSentry()](#new-osentry)
- [[static] .getClient()](#static-getclient)
- [.init()](#init)
- [.getOptions()](#getoptions)
- [.sendResponse()](#sendresponse)
- [.captureMessage()](#capturemessage)
- [Other properties](#other-properties)

<hr>

### new OSentry()

```ts
new OSentry( config?: OSentryConfig );

interface OSentryConfig {
  dsn?: string;
  sentryDsn?: string;     // same as 'dsn'
  environment?: string;   // def: 'UNDEFINED'
  projectname?: string;   // optional tag
  projectserver?: string; // optional tag
  defaultTags?: string[]; // def: DEFAULT_TAGS
  autoInit?: boolean;     // def: true
  options?: OSentryConfigOptions;  // from '@sentry/node/types'
}

interface OSentryConfigOptions extends NodeOptions {
  // { NodeOptions } from '@sentry/node/types'
  normalizeDepth: number;
}

const DEFAULT_TAGS = [ 'projectname', 'projectserver', 'lang', 'database', 'action', 'task' ];
```

When create `new OSentry` it can be passed all config and it inits automatically.

By default, `options` is prepared to show in _extra objects_ a `normalizeDepth` to `10`.

On the other hand, `defaulTags` is a _keys array_, so when `OSentry.sendResponse( responseObject )`,
these keys are moved from 'extra' to 'tags'.

Note: `environment` tag can be only declared here.

<hr>

### [static] .getClient()

```ts
OSentry.getClient(): SentryClient
```

If yu want to use the _lib_ `Sentry`, you can get it easily.

Note: You can get it from the class (static) or the object (method).

```ts
const sentry = OSentry.getClient();

//or

const osentry = new OSentry( config );
const sentry = osentry.getClient();
```

<hr>

### .init()

```ts
init( options?: OSentryConfigOptions ): OSentryInitResponse;

interface OSentryConfigOptions extends NodeOptions {
  // { NodeOptions } from '@sentry/node/types'
  normalizeDepth: number;
}

type OSentryInitResponse =
  | SResponseOKBasic
  | SResponseKOObject<OSentryInitError>

interface SResponseOKBasic {
  status: true;
}

interface SResponseKOObject {
  status: false;
  error: {
    msg: string;
    sentry?: Error;
  }
}

interface OSentryInitError {
  msg: string;
  sentry?: Error;
}
```

You can avoid to init `OSentry` by default to init later (with _custom_ `options`).

```js
const osentry = new OSentry({ ...config, autoInit: false });

const responseInit = osentry.init(options);
console.log(responseInit);
// -> { status: true }
```

<hr>

### .getOptions()

```ts
osentry.getOptions(): OSentryConfigOptions;

interface OSentryConfigOptions extends NodeOptions {
  // { NodeOptions } from '@sentry/node/types'
  normalizeDepth: number;
}
```

Once `OSentry` is initiated, you can check `options` _object_.

```js
const osentry = new OSentry(config);

const options = osentry.getOptions();
console.log(options);
// -> {
//   dsn: 'https://...',
//   tracesSampleRate: 0.5,
//   environment: 'DEVELOPMENT',
//   integrations: [ ExtraErrorData { name: 'ExtraErrorData', ... } ],
//   normalizeDepth: 11,
//   defaultIntegrations: [ ... ],
//   autoSessionTracking: false,
//   instrumenter: 'sentry'
// }
```

<hr>

### .sendResponse()

```ts
sendResponse<T extends Record<string, any>>(
  response?: OSentryResponse<T>,
  inConsole?: boolean
): OSentrySendResponse;

type OSentryResponse<T extends Record<string, any>> =
  | SResponseOKObject<OSentryResponseDefaultParams & T>
  | SResponseKOObject<OSentryResponseDefaultParams & T>;

interface OSentryResponseDefaultParams {
  msg?: string;
  message?: string;
  level?: SeverityLevel;
  user?: Partial<ScopeContext['user']>;
  tags?: ScopeContext['tags'];
  projectserver?: string;
  projectname?: string;
}

type OSentrySendResponse =
  | SResponseOKObject<OSentrySendObject>
  | SResponseKOSimple

interface SResponseOKObject {
  status: true;
  event: {
    id: string;
    message: string;
    captureContext: Partial<ScopeContext>;
  }
}

interface SResponseKOSimple {
  status: false;
  error: {
    msg: string;
  }
}

interface OSentrySendObject {
  event: {
    id: string;
    message: string;
    captureContext: Partial<ScopeContext>;
  }
}
```

The `response` _object_ is oriented to be generated by `Ofn.setResponseKO` or `Ofn.setResponseKO`, but it's not necessary.

On the other hand, there are _main keys_ that it's recommended to use wisely.

```js
const response = {
  // if there is no 'level' key, LEVEL is setted by default to 'info' when is true, and 'error' when is false
  status: true | false,
  // if 'error' is an object, it flattens out
  error: { ... },
  // to declare it, better use static OSentry.LEVEL.{ LOG | DEBUG | INFO | WARNING | ERROR | FATAL }
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal',
  // it's the title message of sentry, to avoid be removed from 'extra' use the key 'message'
  msg: '',
  // the whole 'user' key is shown in 'extra', and for 'Sentry user' is only required the sub-keys { id, username, email } )
  user: { id: '', username: '', email: '', ... },
  // tags are ket-value extracted from 'extra' to use as 'Sentry Tags'
  tags: { key: 'value', ... },

  // Pay attention of defaultTags, because that keys are going to be extracted from 'extra' to 'tags'.
  // By default, 'defaultTags' are:
  lang: '',
  database: '',
  action: '',
  task: '',
  projectname   : '', // if not declared, take it from 'OSentry config'
  projectserver : '', // if not declared, take it from 'OSentry config'

  // more not-main keys are saved as 'extra'
  myCustomKey: 'myCustomValue',
  myCustomKeyObj: { ... }, // default depth: 10
}
```

This method allows you to send a managed error to _Sentry_

```js
try {
  // Something that breaks
} catch (err) {
  const msg = err.toString().split('\r\n')[0].replace('\n', ' ');
  osentry.sendResponse(Ofn.setResponseKO(`Custom Error: ${msg}`, { tracking: dataForTracking }));
}
```

Finally, if you want to do both: send an error to Sentry and _console.log_ it, set as `true` the second param.

```js
osentry.sendResponse(response, true);
```

<hr>

### .captureMessage()

```ts
captureMessage(
  message: string,
  captureContext?: Partial<ScopeContext>
): OSentrySendResponse;

// { ScopeContext } from '@sentry/types';

type OSentrySendResponse =
  | SResponseOKObject<OSentrySendObject>
  | SResponseKOSimple;

interface SResponseOKObject {
  status: true;
  event: {
    id: string;
    message: string;
    captureContext: Partial<ScopeContext>;
  }
}

interface SResponseKOSimple {
  status: false;
  error: {
    msg: string;
  }
}

interface OSentrySendObject {
  event: {
    id: string;
    message: string;
    captureContext: Partial<ScopeContext>;
  }
}
```

The method `sendResponse` prepares everything to send the _Sentry ScopeContext_ and
use the method `captureMessage` correctly.

So this method is public to be allowed to be used if another _custom ScopeContext_ is required.

<hr>

### Other properties

When object `osentry` is created, there are other public properties to be accessed.

```ts
osentry.defaultTags: string[];
osentry.projectname?: string;
osentry.projectserver?: string;

readonly osentry.status: boolean;  // to ensure osentry is initiated
readonly osentry.environment: string;
```

On the other hand, there is a static property called `LEVEL` to set level correctly.

```ts
OSentry.LEVEL: OSentryLevels;

interface OSentryLevels {
  LOG: 'log';
  INFO: 'info';
  DEBUG: 'debug';
  WARNING: 'warning';
  ERROR: 'error';
  FATAL: 'fatal';
}
```
