# Oro Sentry

Class OSentry is a wrapper of [@sentry/node](https://www.npmjs.com/package/@sentry/node) 
that allow to use Sentry and send _custom_ events.


```shell
npm install oro-sentry
```

Example:

```js
const OSentry = require( 'oro-sentry' );

let oSentry = new OSentry( {
    projectname: 'testing', 
    projectserver: 'ubuntu32', 
    environment: 'DEVELOPMENT', 
    sentryDsn: 'https://...'
    //or dsn: 'https://...'
});

oSentry.sendResponse( { status: false, error: { msg: 'example', trackError: 777 } } );
oSentry.sendResponse( Ofn.setResponseKO( 'example', { trackError: 777 } ) );
//{
//  status: true,
//  event: {
//    event_id: 'e11c1d4012a146c2b1384945a21d462c',
//    message: 'example',
//    captureContext: {
//      level: 'error',
//      tags: { projectname: 'testing', projectserver: 'ubuntu32' },
//      extra: { trackError: 777 }
//    }
//  }
//}

oSentry.sendResponse( { status: true, msg: 'example 2', level: 'debug' } );
oSentry.sendResponse( Ofn.setResponseOK( 'example 2', { level: OSentry.LEVEL.DEBUG } ) );
//{
//  status: true,
//  event: {
//    event_id: 'e11c1d4012a146c2b1384945a21d462c',
//    message: 'example 2',
//    captureContext: {
//      level: 'debug',
//      tags: { projectname: 'testing', projectserver: 'ubuntu32' }
//    }
//  }
//}
```

## Methods

* [new OSentry()](#new-osentry----)
* [static .getClient()](#static-getclient)
* [.getOptions()](#getoptions)
* [.init( options )](#init-options-)
* [.sendResponse( response, inConsole = false )](#sendresponse-response-inconsole--false-)

### new OSentry( { ... } )

When create `new OSentry` it can be passed all config and it inits automatically.

```js
const OSentry = require( 'oro-sentry' );

const settings: {
    sentryDsn: 'https://...',
    //dsn: 'https://...', it can declared as 'dns' or 'sentryDsn'
    environment,   // it cannot be changed, default: 'UNDEFINED'
    projectname,   // optional tag
    projectserver, // optional tag
    options,       // you can define here 'options' for Sentry.init( options )
    autoInit,      // default: true,
    defaultTags,   // when use 'sendResponse', this keys are moved from 'extra' to 'tags'
    // default: [ 'projectname', 'projectserver', 'lang', 'database', 'action', 'task' ]
}

let oSentry = new OSentry( settings );
```

By default, `options` is prepared to show in _extra objects_ a `normalizeDepth` to `10`.

### static .getClient()

If yu want to use the _object_ `Sentry`, you can get it easily.

```js
const Sentry = OSentry.getClient();
```

### .getOptions()

Once `Sentry` is initiated, you can check `options` _object_.

```js
let oSentry = new OSentry( settings ); // with autInit: true

let options = oSentry.getOptions();
```

### .init( options )

You can avoid to init `OSentry` by default to init later (with _custom_ `options`).

```js
let oSentry = new OSentry( settings ); // with autInit: false

let responseInit = oSentry.init();
```

### .sendResponse( response, inConsole = false )

The _object_ is oriented to generated by `Ofn.setResponseKO` or `Ofn.setResponseKO`, but it's not necessary.

For the other hand, there are _main keys_ that it's recommended to use wisely.

```js
let response = {
    // if there is no key level, set by default LEVEL 'info' | 'error'
    status: true | false,
    // if 'error' is object, it flattens out
    error: { ... },
    // to declare it, better use static OSentry.LEVEL.{ DEBUG | INFO | WARNING | ERROR | FATAL }
    level: 'debug' | 'info' | 'warning' | 'error' | 'fatal',
    // it's the title message of sentry, to avoid be removed from 'extra' use the key 'message'
    msg: '',
    // the key 'user' is obtained from 'extra' ( only the sub-keys { id, username, email } )
    user: { id: '', username: '', email: '', ... },
    // tags are extracted from 'extra' ( allow to be filtered in sentry )
    tags: { key: 'value', ... },
    
    // Pay attention of defaultTags, because that keys are going to be extracted from 'extra' to 'tags'.
    // By default, 'defaultTags' are:
    lang: '',
    database: '',
    action: '',
    task: '',
    projectname   : '', // if not declared, take it from 'OSentry settings'
    projectserver : '', // if not declared, take it from 'OSentry settings'
    
    // more not-main keys are saved as 'extra' 
    myCustomKey: 'myCustomValue',
    myCustomKeyObj: { ... }, // default depth: 10
}
```

This method allows you to send a managed error to _Sentry_

```js
try {
    // Something that breaks
} 
catch( err ) {
    let msg = err.toString().split( '\r\n' )[ 0 ].replace( '\n', ' ' );
    oSentry.sendResponse( Ofn.setResponseKO( `Custom Error: ${msg}`, { tracking: dataForTracking } ) );
}
```

Finally, if you want to do both, send an error to Sentry and _console.log_ it, set as `true` the second param.

```js
oSentry.sendResponse( response, true );
```
