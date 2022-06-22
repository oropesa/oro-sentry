const OSentry = require( '../index' );
const Ofn = require( 'oro-functions' );
const sentryTestkit = require( 'sentry-testkit' );
const waitForExpect = require( 'wait-for-expect' );
const { testkit, sentryTransport } = sentryTestkit();

//

describe('sendResponse', () => {
    test( 'sendResponse no init', async () => {
        let oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'DEVELOPMENT',
            autoInit: false,
            options: {
                transport: sentryTransport,
                beforeSend: ( event, hint ) => { events.push( event ); return event; }
            }
        } );

        let response = oSentry.sendResponse();

        expect( response.status ).toBe( false );
        expect( response.error.msg ).toBe( 'OSentry: not init (sendResponse).' );
    });

    test( 'sendResponse empty', async () => {
        let events = [];

        let oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'DEVELOPMENT',
            options: {
                transport: sentryTransport,
                beforeSend: ( event, hint ) => { events.push( event ); return event; }
            }
        } );

        let response = oSentry.sendResponse();

        expect( response.status ).toBe( true );
        expect( response.event.message ).toBe( 'OSentry: response without msg' );
        expect( response.event.captureContext ).toEqual(
            { level: 'error', tags: { projectname: 'testing', projectserver: 'ubuntu32' } } );

        await waitForExpect(() => {
            expect( events.length ).toBe( 1 );

            let event = events[ 0 ];

            expect( event.event_id ).toBe( response.event.id );
            expect( event.message ).toBe( response.event.message );
            expect( event.level ).toBe( response.event.captureContext.level );
            expect( event.tags ).toEqual( response.event.captureContext.tags );
            expect( event.environment ).toBe( 'DEVELOPMENT' );
        });
    } );

    test( 'sendResponse simple ok', async () => {
        let events = [];

        let oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'DEVELOPMENT',
            options: {
                transport: sentryTransport,
                beforeSend: ( event, hint ) => { events.push( event ); return event; }
            }
        } );

        let response = oSentry.sendResponse( Ofn.setResponseOK( 'Chacho' ) );

        expect( response.status ).toBe( true );
        expect( response.event.message ).toBe( 'Chacho' );
        expect( response.event.captureContext ).toEqual(
            { level: 'info', tags: { projectname: 'testing', projectserver: 'ubuntu32' } } );

        await waitForExpect(() => {
            expect( events.length ).toBe( 1 );

            let event = events[ 0 ];

            expect( event.event_id ).toBe( response.event.id );
            expect( event.message ).toBe( response.event.message );
            expect( event.level ).toBe( response.event.captureContext.level );
            expect( event.tags ).toEqual( response.event.captureContext.tags );
            expect( event.environment ).toBe( 'DEVELOPMENT' );
        });
    } );

    test( 'sendResponse details', async () => {
        let events = [];

        let oSentry = new OSentry( {
            dsn: 'https://exampleDSN@test.com/0',
            projectname: 'testing',
            projectserver: 'ubuntu32',
            environment: 'PRE_PRODUCTION',
            options: {
                transport: sentryTransport,
                beforeSend: ( event, hint ) => { events.push( event ); return event; }
            }
        } );

        let response = oSentry.sendResponse(
            Ofn.setResponseKO( 'Chacho', {
                level: OSentry.LEVEL.DEBUG,
                tags: { loco: 'tio' },
                user: { id: 7, username: 'oro', name: 'oropesa', email: 'carlos@oropensando.com' },
                foo: 'bar'
            } ) );

        expect( response.status ).toBe( true );
        expect( response.event.message ).toBe( 'Chacho' );
        expect( response.event.captureContext ).toEqual( {
            level: 'debug',
            tags: { projectname: 'testing', projectserver: 'ubuntu32', loco: 'tio' },
            user: { id: 7, username: 'oro', email: 'carlos@oropensando.com' },
            extra: {
                foo: 'bar',
                user: { id: 7, username: 'oro', name: 'oropesa', email: 'carlos@oropensando.com' }
            }
        } );

        await waitForExpect(() => {
            expect( events.length ).toBe( 1 );

            let event = events[ 0 ];

            expect( event.event_id ).toBe( response.event.id );
            expect( event.message ).toBe( response.event.message );
            expect( event.level ).toBe( response.event.captureContext.level );
            expect( event.tags ).toEqual( response.event.captureContext.tags );
            expect( event.user ).toEqual( response.event.captureContext.user );
            expect( event.extra ).toEqual( response.event.captureContext.extra );
            expect( event.environment ).toBe( 'PRE_PRODUCTION' );
        });
    } );
});
