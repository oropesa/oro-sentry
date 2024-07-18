import type { NodeOptions } from '@sentry/node';
import type { ScopeContext, SeverityLevel } from '@sentry/types';
import type {
  SResponseKOObject,
  SResponseKOObjectSimple,
  SResponseKOSimple,
  SResponseOKBasic,
  SResponseOKObject,
} from 'oro-functions-client';

export interface OSentryLevels {
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

//

export interface OSentryResponseExtraDefaults {
  msg?: string;
  message?: string;
  level?: SeverityLevel;
  user?: Partial<ScopeContext['user']>;
  tags?: ScopeContext['tags'];
  projectserver?: string;
  projectname?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OSentryResponseExtra<T extends Record<string, any>> = OSentryResponseExtraDefaults & T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OSentryResponse<T extends Record<string, any>> =
  | SResponseOKObject<OSentryResponseExtra<T>>
  | SResponseKOObject<OSentryResponseExtra<T>>
  | SResponseKOObjectSimple<OSentryResponseExtra<T>>;

//

export interface OSentrySendObject {
  event: {
    id: string;
    message: string;
    captureContext: Partial<ScopeContext>;
  };
}

export type OSentrySendResponse = SResponseOKObject<OSentrySendObject> | SResponseKOSimple;
