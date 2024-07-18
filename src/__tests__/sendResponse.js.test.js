const Ofn = require('oro-functions-client');
const sentryTestkit = require('sentry-testkit');
const waitForExpect = require('wait-for-expect');

const { OSentry } = require('../OSentry');
const { OSENTRY_DEFAULT_CONFIG } = require('./_consts.mocks');

const { sentryTransport } = sentryTestkit();

//

describe('sendResponse', () => {
  test('sendResponse wrong-response as empty', async () => {
    const events = [];

    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event);
          return event;
        },
      },
    });

    const response = osentry.sendResponse('example');

    expect(response.status).toBe(true);
    if (!response.status) {
      return;
    }

    expect(response.event.message).toBe('OSentry: response without msg');
    expect(response.event.captureContext).toEqual({
      level: 'error',
      tags: { projectname: 'testing', projectserver: 'ubuntuDEV32' },
    });

    await waitForExpect(() => {
      expect(events.length).toBe(1);

      const event = events[0];

      expect(event.event_id).toBe(response.event.id);
      expect(event.message).toBe(response.event.message);
      expect(event.level).toBe(response.event.captureContext.level);
      expect(event.tags).toEqual(response.event.captureContext.tags);
      expect(event.environment).toBe('DEVELOPMENT');
    });
  });
});
