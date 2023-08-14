const Ofn = require( 'oro-functions' );
const Sentry = require( '@sentry/node' );
const { ExtraErrorData } = require( '@sentry/integrations' );

const DEFAULT_TAGS = [ 'projectname', 'projectserver', 'lang', 'database', 'action', 'task' ];

class OSentry {

    static LEVEL = {
        LOG: 'log',
        INFO: 'info',
        DEBUG: 'debug',
        WARNING: 'warning',
        ERROR: 'error',
        FATAL: 'fatal'
    };

    #dsn;
    #status;
    #environment;
    #defaultOptions;
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
        this.defaultTags = Ofn.cloneObject( Ofn.isArray( defaultTags ) ? defaultTags : DEFAULT_TAGS );

        this.#defaultOptions = options;

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

        const defaultOptions = Ofn.cloneObject( {
            ...this.#defaultOptions,
            ...(Ofn.isObject( options ) ? options : {})
        } );

        ! this.#dsn && Ofn.isString( defaultOptions.dsn ) && ( this.#dsn = defaultOptions.dsn );
        defaultOptions.dsn && ( delete defaultOptions.dsn );

        Ofn.isString( defaultOptions.environment ) && ( this.#environment = defaultOptions.environment );
        defaultOptions.environment && ( delete defaultOptions.environment );

        if( ! this.#dsn ) {
            console.error( 'OSentry: Sentry need DSN.' );
            return Ofn.setResponseKO( 'OSentry: Sentry need DSN.' );
        }

        ! Ofn.isUndefined( defaultOptions.normalizeDepth ) && ! Ofn.isNumeric( defaultOptions.normalizeDepth ) && ( defaultOptions.normalizeDepth = 11 );
        const normalizeDepth = defaultOptions.normalizeDepth || 11;
        delete defaultOptions.normalizeDepth;

        this.#sentryOptions = {
            dsn: this.#dsn,
            tracesSampleRate: 0.5,
            environment: this.#environment,
            integrations: [ new ExtraErrorData( { depth: normalizeDepth - 1 } ) ],
            normalizeDepth,
            ...defaultOptions,
        };

        try {
            Sentry.init( this.#sentryOptions );
        }
        catch( err ) {
            const msg = err.toString().split( '\r\n' )[ 0 ].replace( '\n', ' ' );
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

        const msg = extra.msg || extra.message || 'OSentry: response without msg';
        delete extra.msg;

        const level = extra.level || ( extra.status ? OSentry.LEVEL.INFO : OSentry.LEVEL.ERROR );
        delete extra.level;
        delete extra.status;

        extra.projectserver === undefined && this.projectserver && ( extra.projectserver = this.projectserver );
        extra.projectname === undefined && this.projectname && ( extra.projectname = this.projectname );

        let user = Ofn.cloneObjectWithKeys( extra.user, [ 'id', 'username', 'email' ] );
        Ofn.objIsEmpty( extra.user ) && ( delete extra.user );

        const tags = Ofn.cloneObject( extra.tags || {} );
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

        const id = Sentry.captureMessage( message, captureContext );

        return Ofn.setResponseOK( { event: { id, message, captureContext } } );
    }

}

module.exports = OSentry;