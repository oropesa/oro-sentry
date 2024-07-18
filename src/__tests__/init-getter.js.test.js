const { Integration } = require('@sentry/types');
const { type } = require('oro-functions-client');
const sentryTestkit = require('sentry-testkit');

const { OSentry } = require('../OSentry');
const { OSENTRY_DEFAULT_CONFIG } = require('./_consts.mocks');

//

const { sentryTransport } = sentryTestkit();

describe('new OSentry()', () => {
  test('OSentry wrong init options-type', async () => {
    const osentry = new OSentry();

    osentry.init([]);

    expect(type(osentry, true)).toBe('OSentry');
    expect(osentry.status).toBe(false);
    expect(osentry.environment).toBe('UNDEFINED');
    expect(osentry.projectname).toBe(undefined);
    expect(osentry.projectserver).toBe(undefined);
    expect(osentry.defaultTags).toEqual(['projectname', 'projectserver', 'lang', 'database', 'action', 'task']);
  });
});
