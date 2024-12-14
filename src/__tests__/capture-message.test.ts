import type { ErrorEvent } from '@sentry/types';
import sentryTestkit from 'sentry-testkit';
import waitForExpect from 'wait-for-expect';

import { OSentry } from '../OSentry';
import { OSENTRY_DEFAULT_CONFIG, defaultConsoleError, mockConsoleError } from './_consts.mocks';

const { sentryTransport } = sentryTestkit();

//

describe('captureMessage', () => {
  afterEach(() => {
    console.error = defaultConsoleError;
    mockConsoleError.mockReset();
  });

  test('captureMessage no init', async () => {
    console.error = mockConsoleError;

    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      autoInit: false,
    });

    const response = osentry.captureMessage('message', {}, true);

    expect(response.status).toBe(false);
    if (response.status) {
      return;
    }

    expect(response.error.msg).toBe('OSentry: not init (captureMessage).');
    expect(mockConsoleError).toHaveBeenCalledWith('OSentry: not init (captureMessage).');
  });

  test('captureMessage no init w/o console', async () => {
    console.error = mockConsoleError;

    const osentry = new OSentry({
      ...OSENTRY_DEFAULT_CONFIG,
      autoInit: false,
    });

    const response = osentry.captureMessage('message', {});

    expect(response.status).toBe(false);
    if (response.status) {
      return;
    }

    expect(response.error.msg).toBe('OSentry: not init (captureMessage).');
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  test('captureMessage details', async () => {
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

    const response = osentry.captureMessage('Chacho', {
      level: 'debug',
      tags: { loco: 'tio', projectname: 'testing', projectserver: 'ubuntuDEV32' },
      user: { id: '7', username: 'oro', email: 'carlos@oropensando.com' },
      extra: { user: { id: '7', username: 'oro', name: 'oropesa', email: 'carlos@oropensando.com' }, foo: 'bar' },
    });

    expect(response.status).toBe(true);
    if (!response.status) {
      return;
    }

    expect(response.event.message).toBe('Chacho');
    expect(response.event.captureContext).toEqual({
      level: 'debug',
      tags: { projectname: 'testing', projectserver: 'ubuntuDEV32', loco: 'tio' },
      user: { id: '7', username: 'oro', email: 'carlos@oropensando.com' },
      extra: { user: { id: '7', username: 'oro', name: 'oropesa', email: 'carlos@oropensando.com' }, foo: 'bar' },
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
