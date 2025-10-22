import * as Sentry from '@sentry/node';
import type { ScopeContext } from '@sentry/types';
import Ofn from 'oro-functions-client';

import {
  OSentryConfig,
  OSentryConfigOptions,
  OSentryInitResponse,
  OSentryLevels,
  OSentryResponse,
  OSentryResponseExtra,
  OSentrySendResponse,
} from './OSentry.types';

const DEFAULT_TAGS = ['projectname', 'projectserver', 'lang', 'database', 'action', 'task'];

export const OSENTRY_LEVEL: OSentryLevels = {
  LOG: 'log',
  INFO: 'info',
  DEBUG: 'debug',
  WARNING: 'warning',
  ERROR: 'error',
  FATAL: 'fatal',
};

export class OSentry {
  public static LEVEL = OSENTRY_LEVEL;

  // NOTE: Sentry SDK has no type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static getClient(): any {
    return Sentry;
  }

  public defaultTags: string[];
  public projectname?: string;
  public projectserver?: string;

  #dsn?: string;
  #status: boolean = false;
  #environment: string;
  readonly #defaultOptions: OSentryConfigOptions;
  #sentryOptions?: OSentryConfigOptions;

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
    this.#dsn = sentryDsn || dsn;
    if (!Ofn.isString(this.#dsn)) {
      this.#dsn = undefined;
    }

    this.projectname = projectname;
    this.projectserver = projectserver;
    this.defaultTags = Ofn.cloneObject(Ofn.isArray(defaultTags) ? defaultTags : DEFAULT_TAGS);
    this.#environment = environment || 'UNDEFINED';
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

  // NOTE: Sentry SDK has no type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getClient(): any {
    return OSentry.getClient();
  }

  public getOptions(): OSentryConfigOptions | undefined {
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

    if (!this.#dsn && Ofn.isString(defaultOptions.dsn)) {
      this.#dsn = defaultOptions.dsn;
    }
    if (defaultOptions.dsn) {
      delete defaultOptions.dsn;
    }

    if (Ofn.isString(defaultOptions.environment)) {
      this.#environment = defaultOptions.environment;
    }
    if (defaultOptions.environment) {
      delete defaultOptions.environment;
    }

    if (!this.#dsn) {
      console.error('OSentry: Sentry need DSN.');
      return Ofn.setResponseKO('OSentry: Sentry need DSN.');
    }

    if (!Ofn.isUndefined(defaultOptions.normalizeDepth) && !Ofn.isNumeric(defaultOptions.normalizeDepth)) {
      defaultOptions.normalizeDepth = 11;
    }

    const normalizeDepth = defaultOptions.normalizeDepth || 11;
    delete defaultOptions.normalizeDepth;

    this.#sentryOptions = {
      dsn: this.#dsn,
      tracesSampleRate: 0.5,
      environment: this.#environment,
      integrations: [Sentry.extraErrorDataIntegration({ depth: normalizeDepth - 1 })],
      normalizeDepth,
      ...defaultOptions,
    };

    try {
      Sentry.init(this.#sentryOptions);
    } catch (error: unknown) {
      const msg = (error as Error).toString().split('\r\n')[0].replace(/\n/g, ' ');
      return Ofn.setResponseKO(`OSentry init failed: ${msg}`, { sentry: error as Error });
    }

    this.#status = true;
    return Ofn.setResponseOK();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sendResponse<T extends Record<string, any>>(
    response: OSentryResponse<T>,
    inConsole = false,
  ): OSentrySendResponse {
    if (inConsole) {
      console.log(response);
    }

    if (!this.#status) {
      console.error('OSentry: not init (sendResponse).');
      return Ofn.setResponseKO('OSentry: not init (sendResponse).');
    }

    // prepare "extra" from response

    let extra: OSentryResponseExtra<T> | undefined = {} as OSentryResponseExtra<T>;
    if (Ofn.isObject(response)) {
      if (response.status) {
        const { status: _, ...rest } = Ofn.cloneObject(response);
        extra = rest as OSentryResponseExtra<T>;
      } else {
        const { status: _, error, ...rest } = Ofn.cloneObject(response);
        extra = { ...(error as OSentryResponseExtra<T>), ...rest };
      }
    }

    // prepare "msg", "level", "tags", "user"

    const msg = extra?.msg || extra?.message || 'OSentry: response without msg';
    const level = extra?.level || (response?.status ? OSentry.LEVEL.INFO : OSentry.LEVEL.ERROR);
    const tags = Ofn.cloneObject(extra?.tags || {});
    let user: Pick<ScopeContext['user'], 'id' | 'username' | 'email'> | undefined;

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

    if (Ofn.objIsEmpty(user)) {
      user = undefined;
    }
    if (Ofn.objIsEmpty(extra)) {
      extra = undefined;
    }

    //

    return this.captureMessage(msg, { level, tags, user, extra });
  }

  public captureMessage(
    message: string,
    captureContext: Partial<ScopeContext>,
    inConsole = false,
  ): OSentrySendResponse {
    if (!this.#status) {
      if (inConsole) {
        console.error('OSentry: not init (captureMessage).');
      }

      return Ofn.setResponseKO('OSentry: not init (captureMessage).');
    }

    // NOTE: `Partial<ScopeContext>` is an option of `CaptureContext`, that is an option of `captureMessage` second-parameter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = Sentry.captureMessage(message, captureContext as any);

    return Ofn.setResponseOK({ event: { id, message, captureContext } });
  }
}
