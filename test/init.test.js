const Ofn = require( 'oro-functions' );
const OSentry = require( '../index' );
const sentryTestkit = require( 'sentry-testkit' );

const { sentryTransport } = sentryTestkit();

//

describe( 'getClient Sentry', () => {
    test( 'get Sentry (static)', async() => {
        const sentry = OSentry.getClient();

        console.log( Ofn.type(sentry, true) );

        expect( Ofn.type( sentry.init ) ).toBe( 'function' );
        expect( Ofn.type( sentry.captureEvent ) ).toBe( 'function' );
        expect( Ofn.type( sentry.captureException ) ).toBe( 'function' );
        expect( Ofn.type( sentry.captureMessage ) ).toBe( 'function' );
        expect( Ofn.type( sentry.Scope ) ).toBe( 'class' );
    } );

    test( 'get Sentry (object)', async() => {
        const oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32'
        } );
        const sentry = oSentry.getClient();

        expect( Ofn.type( sentry.init ) ).toBe( 'function' );
        expect( Ofn.type( sentry.captureEvent ) ).toBe( 'function' );
        expect( Ofn.type( sentry.captureException ) ).toBe( 'function' );
        expect( Ofn.type( sentry.captureMessage ) ).toBe( 'function' );
        expect( Ofn.type( sentry.Scope ) ).toBe( 'class' );
    } );
} );

describe( 'new OSentry()', () => {
    test( 'OSentry empty props', async() => {
        const oSentry = new OSentry();

        expect( Ofn.type( oSentry, true ) ).toBe( 'OSentry' );
        expect( oSentry.status ).toBe( false );
        expect( oSentry.environment ).toBe( 'UNDEFINED' );
        expect( oSentry.projectname ).toBe( undefined );
        expect( oSentry.projectserver ).toBe( undefined );
        expect( oSentry.defaultTags ).toEqual( [
            'projectname',
            'projectserver',
            'lang',
            'database',
            'action',
            'task'
        ] );
    } );

    test( 'new OSentry() no-dsn', async() => {
        const oSentry = new OSentry( {
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'DEVELOPMENT',
            defaultTags: [ 'karma', 'topic', 'origin' ],
        } );

        expect( oSentry.status ).toBe( false );
        expect( oSentry.environment ).toBe( 'DEVELOPMENT' );
        expect( oSentry.projectname ).toBe( 'testing' );
        expect( oSentry.projectserver ).toBe( 'ubuntu32' );
        expect( oSentry.defaultTags ).toEqual( [ 'karma', 'topic', 'origin' ] );
    } );

    test( 'new OSentry() dsn', async() => {
        const oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32'
        } );

        expect( oSentry.status ).toBe( true );
    } );

    test( 'new OSentry() dsn no autoinit', async() => {
        const oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            autoInit: false
        } );

        expect( oSentry.status ).toBe( false );

        const responseInit = oSentry.init();

        expect( oSentry.status ).toBe( true );
        expect( responseInit.status ).toBe( true );
    } );

    test( 'new OSentry() dsn init twice', async() => {
        const oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32'
        } );

        expect( oSentry.status ).toBe( true );

        const responseInit = oSentry.init();

        expect( oSentry.status ).toBe( true );
        expect( responseInit.status ).toBe( false );
        if( responseInit.status === true ) {
            return;
        }

        expect( responseInit.error.msg ).toBe( 'OSentry is already init.' );
    } );

    test( 'new OSentry() dsn vars', async() => {
        const oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'DEVELOPMENT'
        } );

        //environment is a getter, cannot be changed
        // oSentry.environment = 'chacho';
        oSentry.projectname = 'testing2';
        oSentry.projectserver = 'ubuntu64';

        expect( oSentry.status ).toBe( true );
        expect( oSentry.environment ).toBe( 'DEVELOPMENT' );
        expect( oSentry.projectname ).toBe( 'testing2' );
        expect( oSentry.projectserver ).toBe( 'ubuntu64' );
    } );

    test( 'new OSentry() dsn getOptions default', async() => {
        const oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'DEVELOPMENT',
            autoInit: false
        } );

        expect( oSentry.getOptions() ).toBe( undefined );

        oSentry.init();

        const options = oSentry.getOptions();

        expect( oSentry.status ).toBe( true );
        expect( options.dsn ).toBe( 'https://exampleDSN@test.com/0' );
        expect( options.tracesSampleRate ).toBe( 0.5 );
        expect( options.environment ).toBe( 'DEVELOPMENT' );
        expect( options.integrations[ 0 ].name ).toBe( 'ExtraErrorData' );
        expect( options.integrations[ 0 ]._options.depth ).toBe( 10 );
        expect( options.normalizeDepth ).toBe( 11 );
    } );

    test( 'new OSentry() dsn getOptions', async() => {
        const oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'DEVELOPMENT',
            options: {
                transport: sentryTransport,
                normalizeDepth: 5,
            }
        } );

        const options = oSentry.getOptions();

        expect( oSentry.status ).toBe( true );
        expect( options.dsn ).toBe( 'https://exampleDSN@test.com/0' );
        expect( options.tracesSampleRate ).toBe( 0.5 );
        expect( options.environment ).toBe( 'DEVELOPMENT' );
        expect( options.integrations[ 0 ].name ).toBe( 'ExtraErrorData' );
        expect( options.integrations[ 0 ]._options.depth ).toBe( 4 );
        expect( options.normalizeDepth ).toBe( 5 );
        expect( Ofn.type( options.transport ) ).toBe( 'function' );
    } );
} );
