import type { ErrorEvent } from '@sentry/types';
import Ofn from 'oro-functions-client';
import sentryTestkit from 'sentry-testkit';
import waitForExpect from 'wait-for-expect';

import { OSentry } from '../OSentry';
import { OSENTRY_DEFAULT_CONFIG } from './_consts.mocks';

const { sentryTransport } = sentryTestkit();

//

describe('sendResponse', () => {
  test('sendResponse no init', async () => {
    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      autoInit: false,
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => event,
      },
    });

    const response = osentry.sendResponse(Ofn.setResponseKO(''), true);

    expect(response.status).toBe(false);
    if (response.status) {
      return;
    }

    expect(response.error.msg).toBe('OSentry: not init (sendResponse).');
  });

  test('sendResponse empty', async () => {
    const events: ErrorEvent[] = [];

    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event as ErrorEvent);
          return event;
        },
      },
    });

    const response = osentry.sendResponse(Ofn.setResponseKO(''));

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

  test('sendResponse simple ok', async () => {
    const events: ErrorEvent[] = [];

    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event as ErrorEvent);
          return event;
        },
      },
    });

    const response = osentry.sendResponse(Ofn.setResponseOK('Chacho'));

    expect(response.status).toBe(true);
    if (!response.status) {
      return;
    }

    expect(response.event.message).toBe('Chacho');
    expect(response.event.captureContext).toEqual({
      level: 'info',
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

  test('sendResponse simple ko', async () => {
    const events: ErrorEvent[] = [];

    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event as ErrorEvent);
          return event;
        },
      },
    });

    const response = osentry.sendResponse(Ofn.setResponseKO('Chacho KO', { level: OSentry.LEVEL.FATAL }));

    expect(response.status).toBe(true);
    if (!response.status) {
      return;
    }

    expect(response.event.message).toBe('Chacho KO');
    expect(response.event.captureContext).toEqual({
      level: OSentry.LEVEL.FATAL,
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

  test('sendResponse details', async () => {
    const events: ErrorEvent[] = [];

    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      environment: 'PRE_PRODUCTION',
      options: {
        transport: sentryTransport,
        beforeSend: (event, _hint) => {
          events.push(event as ErrorEvent);
          return event;
        },
      },
    });

    // NOTE: this should have a typescript error
    // osentry.sendResponse<{ foo: number }>(Ofn.setResponseOK('Chacho', { level: OSentry.LEVEL.DEBUG, foo: 'bar' }));
    // osentry.sendResponse(Ofn.setResponseKO<{ foo: number }>('Chacho', { foo: 'bar' }));

    const response = osentry.sendResponse<{ foo: string }>(
      Ofn.setResponseKO('Chacho', {
        level: OSentry.LEVEL.DEBUG,
        tags: { loco: 'tio' },
        user: { id: '7', username: 'oro', name: 'oropesa', email: 'carlos@oropensando.com' },
        foo: 'bar',
      }),
    );

    expect(response.status).toBe(true);
    if (!response.status) {
      return;
    }

    expect(response.event.message).toBe('Chacho');
    expect(response.event.captureContext).toEqual({
      level: 'debug',
      tags: { projectname: 'testing', projectserver: 'ubuntuDEV32', loco: 'tio' },
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
