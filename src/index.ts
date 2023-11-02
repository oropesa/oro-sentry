import Ofn from 'oro-functions';
import * as Sentry from '@sentry/node';
import { ExtraErrorData } from '@sentry/integrations';
import type { NodeOptions } from '@sentry/node';
import type { ScopeContext, SeverityLevel } from '@sentry/types';
import type {
  SResponseOKBasic,
  SResponseKOSimple,
  SResponseOKObject,
  SResponseKOObject,
  SResponseKOObjectSimple,
} from 'oro-functions';

export interface OSentryLevelObject {
  LOG: 'log';
  INFO: 'info';
  DEBUG: 'debug';
  WARNING: 'warning';
  ERROR: 'error';
  FATAL: 'fatal';
}

export interface OSentryConfigOptions extends NodeOptions {
  normalizeDepth?: number;
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

export type OSentryInitResponse = SResponseOKBasic | SResponseKOObject<OSentryInitError>;

export interface OSentryResponseDefaultParams {
  msg?: string;
  message?: string;
  level?: SeverityLevel;
  user?: Partial<ScopeContext['user']>;
  tags?: ScopeContext['tags'];
  projectserver?: string;
  projectname?: string;
}

export type OSentryResponse<T extends Record<string, any>> =
  | SResponseOKObject<OSentryResponseDefaultParams & T>
  | SResponseKOSimple
  | SResponseKOObject<OSentryResponseDefaultParams & T>
  | SResponseKOObjectSimple<OSentryResponseDefaultParams & T>;

export interface OSentrySendObject {
  event: {
    id: string;
    message: string;
    captureContext: Partial<ScopeContext>;
  };
}

export type OSentrySendResponse = SResponseOKObject<OSentrySendObject> | SResponseKOSimple;

const DEFAULT_TAGS = ['projectname', 'projectserver', 'lang', 'database', 'action', 'task'];

export class OSentry {
  public static LEVEL: OSentryLevelObject = {
    LOG: 'log',
    INFO: 'info',
    DEBUG: 'debug',
    WARNING: 'warning',
    ERROR: 'error',
    FATAL: 'fatal',
  };

  public static getClient(): any {
    return Sentry;
  }

  public defaultTags: string[];
  public projectname?: string;
  public projectserver?: string;

  #dsn?: string;
  #status: boolean;
  #environment: string;
  readonly #defaultOptions: OSentryConfigOptions;
  // @ts-ignore
  #sentryOptions: OSentryConfigOptions;

  public constructor({
    dsn,
    sentryDsn,
    environment,
    projectname,
    projectserver,
    defaultTags,
    autoInit = true,
    options = {},
  }: OSentryConfig = {}) {
    this.#status = false;
    this.#dsn = sentryDsn || dsn;

    !Ofn.isString(this.#dsn) && (this.#dsn = undefined);

    this.#environment = environment || 'UNDEFINED';
    this.projectname = projectname;
    this.projectserver = projectserver;
    this.defaultTags = Ofn.cloneObject(Ofn.isArray(defaultTags) ? defaultTags : DEFAULT_TAGS);
    this.#defaultOptions = options;

    if (this.#dsn && autoInit) {
      this.init();
    }
  }

  public get status(): boolean {
    return this.#status;
  }

  public get environment(): string {
    return this.#environment;
  }

  public getClient(): any {
    return OSentry.getClient();
  }

  public getOptions(): OSentryConfigOptions {
    return this.#sentryOptions;
  }

  public init(options: OSentryConfigOptions = {}): OSentryInitResponse {
    if (this.#status) {
      return Ofn.setResponseKO('OSentry is already init.');
    }

    const defaultOptions: OSentryConfigOptions = Ofn.cloneObject({
      ...this.#defaultOptions,
      ...(Ofn.isObject(options) ? options : {}),
    });

    !this.#dsn && Ofn.isString(defaultOptions.dsn) && (this.#dsn = defaultOptions.dsn);
    defaultOptions.dsn && delete defaultOptions.dsn;

    Ofn.isString(defaultOptions.environment) && (this.#environment = defaultOptions.environment);
    defaultOptions.environment && delete defaultOptions.environment;

    if (!this.#dsn) {
      console.error('OSentry: Sentry need DSN.');
      return Ofn.setResponseKO('OSentry: Sentry need DSN.');
    }

    !Ofn.isUndefined(defaultOptions.normalizeDepth) &&
      !Ofn.isNumeric(defaultOptions.normalizeDepth) &&
      (defaultOptions.normalizeDepth = 11);
    const normalizeDepth = defaultOptions.normalizeDepth || 11;
    delete defaultOptions.normalizeDepth;

    this.#sentryOptions = {
      dsn: this.#dsn,
      tracesSampleRate: 0.5,
      environment: this.#environment,
      integrations: [new ExtraErrorData({ depth: normalizeDepth - 1 })],
      normalizeDepth,
      ...defaultOptions,
    };

    try {
      Sentry.init(this.#sentryOptions);
    } catch (error: any) {
      const msg = error.toString().split('\r\n')[0].replace(/\n/g, ' ');
      return Ofn.setResponseKO(`OSentry init failed: ${msg}`, { sentry: error });
    }

    this.#status = true;
    return Ofn.setResponseOK();
  }

  public sendResponse<T extends Record<string, any>>(
    response: OSentryResponse<T>,
    inConsole = false,
  ): OSentrySendResponse {
    inConsole && console.log(response);

    if (!this.#status) {
      console.error('OSentry: not init (sendResponse).');
      return Ofn.setResponseKO('OSentry: not init (sendResponse).');
    }

    // @ts-ignore
    let extra: undefined | (OSentryResponseDefaultParams & T) = {};
    if (Ofn.isObject(response)) {
      if (response.status) {
        const { status: _, ...rest } = Ofn.cloneObject(response);
        extra = rest as OSentryResponseDefaultParams & T;
      } else {
        const { status: _, error, ...rest } = Ofn.cloneObject(response);
        extra = { ...(error as OSentryResponseDefaultParams & T), ...rest };
      }
    }

    const msg = extra?.msg || extra?.message || 'OSentry: response without msg';
    const level = extra?.level || (response?.status ? OSentry.LEVEL.INFO : OSentry.LEVEL.ERROR);
    const tags = Ofn.cloneObject(extra?.tags || {});
    let user: undefined | Pick<ScopeContext['user'], 'id' | 'username' | 'email'>;

    if (Ofn.isObject(extra)) {
      delete extra.msg;
      delete extra.level;
      delete extra.tags;

      extra.projectserver = extra.projectserver ?? this.projectserver;
      extra.projectname = extra.projectname ?? this.projectname;

      if (Ofn.objIsNotEmpty(extra.user)) {
        user = Ofn.cloneObjectWithKeys(extra.user, ['id', 'username', 'email']);
      } else {
        delete extra.user;
      }

      for (const tagKey of this.defaultTags) {
        if (extra[tagKey] === undefined || tags[tagKey] !== undefined) {
          continue;
        }

        tags[tagKey] = extra[tagKey];
        delete extra[tagKey];
      }
    }

    Ofn.objIsEmpty(user) && (user = undefined);
    Ofn.objIsEmpty(extra) && (extra = undefined);

    return this.captureMessage(msg, { level, tags, user, extra });
  }

  public captureMessage(
    message: string,
    captureContext: Partial<ScopeContext>,
  ): OSentrySendResponse {
    if (!this.#status) {
      console.error('OSentry: not init (captureMessage).');
      return Ofn.setResponseKO('OSentry: not init (captureMessage).');
    }

    const id = Sentry.captureMessage(message, captureContext);

    return Ofn.setResponseOK({ event: { id, message, captureContext } });
  }
}

export default OSentry;
