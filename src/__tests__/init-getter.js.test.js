const { type } = require('oro-functions-client');

const { OSentry } = require('../OSentry');
const { defaultConsoleError, mockConsoleError } = require('./_consts.mocks');

//

describe('new OSentry()', () => {
  afterEach(() => {
    console.error = defaultConsoleError;
    mockConsoleError.mockReset();
  });

  test('OSentry wrong init options-type', async () => {
    console.error = mockConsoleError;

    const osentry = new OSentry();

    osentry.init([]);

    expect(type(osentry, true)).toBe('OSentry');
    expect(osentry.status).toBe(false);
    expect(osentry.environment).toBe('UNDEFINED');
    expect(osentry.projectname).toBe(undefined);
    expect(osentry.projectserver).toBe(undefined);
    expect(osentry.defaultTags).toEqual(['projectname', 'projectserver', 'lang', 'database', 'action', 'task']);

    expect(mockConsoleError).toHaveBeenCalledWith('OSentry: Sentry need DSN.');
  });
});
