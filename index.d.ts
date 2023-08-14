import { ScopeContext, SeverityLevel } from '@sentry/types';
import { NodeOptions } from '@sentry/node/types';
import { SResponse, SResponseOK } from 'oro-functions/src';

export interface OSentryLevelObject {
    LOG: 'log';
    INFO: 'info';
    DEBUG: 'debug';
    WARNING: 'warning';
    ERROR: 'error';
    FATAL: 'fatal';
}

export interface OSentryConfigOptions extends NodeOptions {
    normalizeDepth: number
}

export interface OSentryConfig {
    dsn?: string;
    sentryDsn?: string;
    environment?: string;
    projectname?: string;
    projectserver?: string;
    defaultTags?: string[];
    autoInit?: boolean;
    options?: OSentryConfigOptions;
}

export interface OSentryInitError {
    msg: string;
    sentry?: Error;
}

export type OSentryInitResponse = SResponse<SResponseOK, OSentryInitError>;

export interface OSentryResponseDefaultParams {
    msg?: string;
    message?: string;
    level?: SeverityLevel;
    user?: Partial<ScopeContext['user']>;
    tags?: ScopeContext['tags'];
    projectserver?: string;
    projectname?: string;
}

export type OSentryResponse<T extends object = {}> = SResponse<
    OSentryResponseDefaultParams & T,
    OSentryResponseDefaultParams & T
>

export interface OSentrySendOK {
    event: {
        id: string;
        message: string;
        captureContext: Partial<ScopeContext>;
    }
}

export interface OSentrySendError {
    msg: string;
}

export type OSentrySendResponse = SResponse<OSentrySendOK, OSentrySendError>;

declare class OSentry {
    constructor( config?: OSentryConfig );

    static LEVEL: OSentryLevelObject;

    defaultTags: string[];
    projectname?: string;
    projectserver?: string;

    get status(): boolean;
    get environment(): string;

    static getClient(): any;
    getClient(): any;

    getOptions(): OSentryConfigOptions;

    init( options?: OSentryConfigOptions ): OSentryInitResponse;

    sendResponse<T extends object = {}>( response?: OSentryResponse<T>, inConsole?: boolean ): OSentrySendResponse;
    captureMessage( message: string, captureContext?: Partial<ScopeContext> ): OSentrySendResponse;
}

export default OSentry;