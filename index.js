const Ofn = require( 'oro-functions' );
const Sentry = require( '@sentry/node' );
const { ExtraErrorData } = require( '@sentry/integrations' );

class OSentry {

    static LEVEL = { DEBUG: 'debug', INFO: 'info', WARNING: 'warning', ERROR: 'error', FATAL: 'fatal' };

    #dsn;
    #status;
    #environment;
    #constOptions;
    #sentryOptions;

    defaultTags;
    projectname;
    projectserver;

    constructor( { dsn, sentryDsn, environment, projectname, projectserver, defaultTags, autoInit = true, options = {} } = {} ) {
        this.#status = false;
        this.#dsn = sentryDsn || dsn;

        ! Ofn.isString( this.#dsn ) && ( this.#dsn = undefined );

        this.#environment = environment || 'UNDEFINED';
        this.projectname = projectname;
        this.projectserver = projectserver;
        this.defaultTags = Ofn.isArray( defaultTags ) ? defaultTags :
            [ 'projectname', 'projectserver', 'lang', 'database', 'action', 'task' ];

        this.#constOptions = options;

        if( this.#dsn && autoInit ) {
            this.init();
        }
    }

    get status() { return this.#status; }
    get environment() { return this.#environment; }

    static getClient() { return Sentry; }
    getClient() { return OSentry.getClient(); }

    getOptions() { return this.#sentryOptions; }

    init( options = {} ) {
        if( this.#status ) { return Ofn.setResponseKO( 'OSentry is already init.' ) }

        let cloneOpts = Object.assign(
            {}, this.#constOptions, Ofn.isObject( options ) ? options : {} );

        ! this.#dsn && Ofn.isString( cloneOpts.dsn ) && ( this.#dsn = cloneOpts.dsn );
        cloneOpts.dsn && ( delete cloneOpts.dsn );

        Ofn.isString( cloneOpts.environment ) && ( this.#environment = cloneOpts.environment );
        cloneOpts.environment && ( delete cloneOpts.environment );

        if( ! this.#dsn ) {
            console.error( 'OSentry: Sentry need DSN.' );
            return Ofn.setResponseKO( 'OSentry: Sentry need DSN.' );
        }

        ! Ofn.isUndefined( cloneOpts.normalizeDepth ) && ! Ofn.isNumeric( cloneOpts.normalizeDepth ) && ( cloneOpts.normalizeDepth = 11 );
        let normalizeDepth = cloneOpts.normalizeDepth || 11;

        this.#sentryOptions = Object.assign( {
            dsn: this.#dsn,
            tracesSampleRate: 0.5,
            environment: this.#environment,
            integrations: [ new ExtraErrorData( { depth: normalizeDepth - 1 } ) ],
            normalizeDepth
        }, cloneOpts );

        try { Sentry.init( this.#sentryOptions ); }
        catch( err ) {
            let msg = err.toString().split( '\r\n' )[ 0 ].replace( '\n', ' ' );
            return Ofn.setResponseKO( `OSentry init failed: ${msg}`, { sentry: err } );
        }

        this.#status = true;

        return Ofn.setResponseOK();
    }

    sendResponse( response, inConsole = false ) {
        inConsole && console.log( response );

        if( ! this.#status ) {
            console.error( 'OSentry: not init (sendResponse).' );
            return Ofn.setResponseKO( 'OSentry: not init (sendResponse).' );
        }

        let extra = Ofn.cloneObject( response || {} );
        if( ! extra.status && Ofn.isObject( extra.error ) ) {
            delete extra.error;
            Object.assign( extra, Ofn.cloneObject( response.error ), extra );
        }

        let msg = extra.msg || extra.message || 'OSentry: response without msg';
        delete extra.msg;

        let level = extra.level || ( extra.status ? OSentry.LEVEL.INFO : OSentry.LEVEL.ERROR );
        delete extra.level;
        delete extra.status;

        extra.projectserver === undefined && this.projectserver && ( extra.projectserver = this.projectserver );
        extra.projectname === undefined && this.projectname && ( extra.projectname = this.projectname );

        let user = Ofn.cloneObjectWithKeys( extra.user, [ 'id', 'username', 'email' ] );
        Ofn.objIsEmpty( extra.user ) && ( delete extra.user );

        let tags = Ofn.cloneObject( extra.tags || {} );
        delete extra.tags;

        this.defaultTags.forEach( tagKey => {
            if( extra[ tagKey ] !== undefined ) {
                tags[ tagKey ] === undefined && ( tags[ tagKey ] = extra[ tagKey ] );
                delete extra[ tagKey ];
            }
        });

        Ofn.objIsEmpty( user ) && ( user = undefined );
        Ofn.objIsEmpty( extra ) && ( extra = undefined );

        return this.captureMessage( msg, { level, tags, user, extra } );
    }

    captureMessage( message, captureContext ) {
        if( ! this.#status ) {
            console.error( 'OSentry: not init (captureMessage).' );
            return Ofn.setResponseKO( 'OSentry: not init (captureMessage).' );
        }

        let id = Sentry.captureMessage( message, captureContext );

        return Ofn.setResponseOK( { event: { id, message, captureContext } } );
    }

}

module.exports = OSentry;