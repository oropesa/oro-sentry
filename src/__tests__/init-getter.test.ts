import { Integration } from '@sentry/types';
import { type } from 'oro-functions-client';
import sentryTestkit from 'sentry-testkit';

import { OSentry } from '../OSentry';
import { OSENTRY_DEFAULT_CONFIG } from './_consts.mocks';

//

const { sentryTransport } = sentryTestkit();

describe('getClient Sentry', () => {
  test('get Sentry (static)', async () => {
    const sentry = OSentry.getClient();

    expect(type(sentry.init)).toBe('function');
    expect(type(sentry.captureEvent)).toBe('function');
    expect(type(sentry.captureException)).toBe('function');
    expect(type(sentry.captureMessage)).toBe('function');
    expect(type(sentry.Scope)).toBe('class');
  });

  test('get Sentry (object)', async () => {
    const osentry = new OSentry({ ...OSENTRY_DEFAULT_CONFIG });
    const sentry = osentry.getClient();

    expect(type(sentry.init)).toBe('function');
    expect(type(sentry.captureEvent)).toBe('function');
    expect(type(sentry.captureException)).toBe('function');
    expect(type(sentry.captureMessage)).toBe('function');
    expect(type(sentry.Scope)).toBe('class');
  });
});

describe('new OSentry()', () => {
  test('OSentry empty props', async () => {
    const osentry = new OSentry();

    expect(type(osentry, true)).toBe('OSentry');
    expect(osentry.status).toBe(false);
    expect(osentry.environment).toBe('UNDEFINED');
    expect(osentry.projectname).toBe(undefined);
    expect(osentry.projectserver).toBe(undefined);
    expect(osentry.defaultTags).toEqual(['projectname', 'projectserver', 'lang', 'database', 'action', 'task']);
  });

  test('new OSentry() no-dsn', async () => {
    const osentry = new OSentry({
      projectname: 'testing',
      projectserver: 'ubuntuDEV32',
      environment: 'DEVELOPMENT',
      defaultTags: ['karma', 'topic', 'origin'],
    });

    expect(osentry.status).toBe(false);
    expect(osentry.environment).toBe('DEVELOPMENT');
    expect(osentry.projectname).toBe('testing');
    expect(osentry.projectserver).toBe('ubuntuDEV32');
    expect(osentry.defaultTags).toEqual(['karma', 'topic', 'origin']);
  });

  test('new OSentry() dsn', async () => {
    const osentry = new OSentry({
      dsn: OSENTRY_DEFAULT_CONFIG.dsn,
    });

    expect(osentry.status).toBe(true);
  });

  test('new OSentry() sentryDsn', async () => {
    const osentry = new OSentry({
      sentryDsn: OSENTRY_DEFAULT_CONFIG.dsn,
    });

    expect(osentry.status).toBe(true);
  });

  test('new OSentry() init options', async () => {
    const osentry = new OSentry();

    osentry.init({
      dsn: OSENTRY_DEFAULT_CONFIG.dsn,
      environment: 'DEVELOPMENT',
    });

    expect(osentry.status).toBe(true);
    expect(osentry.environment).toBe('DEVELOPMENT');
  });

  test('new OSentry() init options wrong normalizeDepth', async () => {
    const osentry = new OSentry();

    osentry.init({
      dsn: OSENTRY_DEFAULT_CONFIG.dsn,
      normalizeDepth: Number.NaN,
    });

    const options = osentry.getOptions();
    if (!options) return;

    expect(options.normalizeDepth).toBe(11);
  });

  test('new OSentry() dsn no autoinit', async () => {
    const osentry = new OSentry({ ...OSENTRY_DEFAULT_CONFIG, autoInit: false });

    expect(osentry.status).toBe(false);

    const responseInit = osentry.init();

    expect(osentry.status).toBe(true);
    expect(responseInit.status).toBe(true);
  });

  test('new OSentry() dsn init twice', async () => {
    const osentry = new OSentry({ ...OSENTRY_DEFAULT_CONFIG });

    expect(osentry.status).toBe(true);

    const responseInit = osentry.init();

    expect(osentry.status).toBe(true);
    expect(responseInit.status).toBe(false);
    if (responseInit.status) {
      return;
    }

    expect(responseInit.error.msg).toBe('OSentry is already init.');
  });

  test('new OSentry() dsn vars', async () => {
    const osentry = new OSentry({ ...OSENTRY_DEFAULT_CONFIG });

    // environment is a getter, cannot be changed
    // osentry.environment = 'chacho';
    osentry.projectname = 'testing2';
    osentry.projectserver = 'ubuntu64';

    expect(osentry.status).toBe(true);
    expect(osentry.environment).toBe('DEVELOPMENT');
    expect(osentry.projectname).toBe('testing2');
    expect(osentry.projectserver).toBe('ubuntu64');
  });

  test('new OSentry() dsn getOptions default', async () => {
    const osentry = new OSentry({ ...OSENTRY_DEFAULT_CONFIG, autoInit: false });

    const initialOptions = osentry.getOptions();
    expect(initialOptions).toBe(undefined);

    osentry.init();

    expect(osentry.status).toBe(true);

    const options = osentry.getOptions();
    if (!options) return;

    expect(options.dsn).toBe(OSENTRY_DEFAULT_CONFIG.dsn);
    expect(options.tracesSampleRate).toBe(0.5);
    expect(options.environment).toBe('DEVELOPMENT');
    expect(options.normalizeDepth).toBe(11);

    const integrations = options.integrations as Integration[];
    expect(integrations[0].name).toBe('ExtraErrorData');
  });

  test('new OSentry() dsn getOptions', async () => {
    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      options: { transport: sentryTransport, normalizeDepth: 5 },
    });

    expect(osentry.status).toBe(true);

    const options = osentry.getOptions();
    if (!options) return;

    expect(options.dsn).toBe(OSENTRY_DEFAULT_CONFIG.dsn);
    expect(options.tracesSampleRate).toBe(0.5);
    expect(options.environment).toBe('DEVELOPMENT');
    expect(options.normalizeDepth).toBe(5);

    const integrations = options.integrations as Integration[];
    expect(integrations[0].name).toBe('ExtraErrorData');

    expect(type(options.transport)).toBe('function');
  });
});
