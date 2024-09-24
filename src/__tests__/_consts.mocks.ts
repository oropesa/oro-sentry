export const OSENTRY_DEFAULT_CONFIG = {
  dsn: 'https://exampleDSN@test.com/0',
  projectname: 'testing',
  projectserver: 'ubuntuDEV32',
  environment: 'DEVELOPMENT',
};

export const defaultConsoleLog = console.log;
export const defaultConsoleError = console.error;
export const mockConsoleLog = jest.fn();
export const mockConsoleError = jest.fn();
