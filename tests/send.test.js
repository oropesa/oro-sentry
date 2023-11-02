const { OSentry } = require('../dist');
const { Ofn } = require('oro-functions');
const sentryTestkit = require('sentry-testkit');
const waitForExpect = require('wait-for-expect');

const { sentryTransport } = sentryTestkit();

//

describe('sendResponse', () => {
  test('sendResponse no init', async () => {
    const oSentry = new OSentry({
      dsn: 'https://exampleDSN@test.com/0',
      projectname: 'testing',
      projectserver: 'ubuntu32',
      environment: 'DEVELOPMENT',
      autoInit: false,
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          return event;
        },
      },
    });

    const response = oSentry.sendResponse(Ofn.setResponseKO(''));

    expect(response.status).toBe(false);
    if (response.status === true) {
      return;
    }

    expect(response.error.msg).toBe('OSentry: not init (sendResponse).');
  });

  test('sendResponse empty', async () => {
    const events = [];

    const oSentry = new OSentry({
      dsn: 'https://exampleDSN@test.com/0',
      projectname: 'testing',
      projectserver: 'ubuntu32',
      environment: 'DEVELOPMENT',
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event);
          return event;
        },
      },
    });

    const response = oSentry.sendResponse();

    expect(response.status).toBe(true);
    if (response.status === false) {
      return;
    }

    expect(response.event.message).toBe('OSentry: response without msg');
    expect(response.event.captureContext).toEqual({
      level: 'error',
      tags: { projectname: 'testing', projectserver: 'ubuntu32' },
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

  test('sendResponse simple ok', async () => {
    const events = [];

    const oSentry = new OSentry({
      dsn: 'https://exampleDSN@test.com/0',
      projectname: 'testing',
      projectserver: 'ubuntu32',
      environment: 'DEVELOPMENT',
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event);
          return event;
        },
      },
    });

    const response = oSentry.sendResponse(Ofn.setResponseOK('Chacho'));

    expect(response.status).toBe(true);
    if (response.status === false) {
      return;
    }

    expect(response.event.message).toBe('Chacho');
    expect(response.event.captureContext).toEqual({
      level: 'info',
      tags: { projectname: 'testing', projectserver: 'ubuntu32' },
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

  test('sendResponse simple ko', async () => {
    const events = [];

    const oSentry = new OSentry({
      dsn: 'https://exampleDSN@test.com/0',
      projectname: 'testing',
      projectserver: 'ubuntu32',
      environment: 'DEVELOPMENT',
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event);
          return event;
        },
      },
    });

    const response = oSentry.sendResponse(
      Ofn.setResponseKO('Chacho KO', { level: OSentry.LEVEL.FATAL }),
    );

    expect(response.status).toBe(true);
    if (response.status === false) {
      return;
    }

    expect(response.event.message).toBe('Chacho KO');
    expect(response.event.captureContext).toEqual({
      level: OSentry.LEVEL.FATAL,
      tags: { projectname: 'testing', projectserver: 'ubuntu32' },
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

  test('sendResponse details', async () => {
    const events = [];

    const oSentry = new OSentry({
      dsn: 'https://exampleDSN@test.com/0',
      projectname: 'testing',
      projectserver: 'ubuntu32',
      environment: 'PRE_PRODUCTION',
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event);
          return event;
        },
      },
    });

    const response = oSentry.sendResponse(
      Ofn.setResponseKO('Chacho', {
        level: OSentry.LEVEL.DEBUG,
        tags: { loco: 'tio' },
        user: { id: '7', username: 'oro', name: 'oropesa', email: 'carlos@oropensando.com' },
        foo: 'bar',
      }),
    );

    expect(response.status).toBe(true);
    if (response.status === false) {
      return;
    }

    expect(response.event.message).toBe('Chacho');
    expect(response.event.captureContext).toEqual({
      level: 'debug',
      tags: { projectname: 'testing', projectserver: 'ubuntu32', loco: 'tio' },
      user: { id: '7', username: 'oro', email: 'carlos@oropensando.com' },
      extra: {
        foo: 'bar',
        user: {
          id: '7',
          username: 'oro',
          name: 'oropesa',
          email: 'carlos@oropensando.com',
        },
      },
    });

    await waitForExpect(() => {
      expect(events.length).toBe(1);

      const event = events[0];

      expect(event.event_id).toBe(response.event.id);
      expect(event.message).toBe(response.event.message);
      expect(event.level).toBe(response.event.captureContext.level);
      expect(event.tags).toEqual(response.event.captureContext.tags);
      expect(event.user).toEqual(response.event.captureContext.user);
      expect(event.extra).toEqual(response.event.captureContext.extra);
      expect(event.environment).toBe('PRE_PRODUCTION');
    });
  });
});
