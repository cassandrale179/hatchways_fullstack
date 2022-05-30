const {
  describe,
  jest,
  it,
  expect,
  beforeEach,
  afterEach,
} = require('@jest/globals');

// ---------------------------------------------------------------- //
//                                                                  //
//                 PLEASE DO NOT MODIFY THIS FILE.                  //
//               Hatchways automation depends on it.                //
//                                                                  //
// ---------------------------------------------------------------- //

describe('App server', () => {
  const originalEnv = process.env;
  describe.each([['3000'], ['4000'], ['5000']])('when PORT is %s', (port) => {
    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        PORT: port,
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should set the PORT', () => {
      const { app } = require('../app');
      const appSetSpy = jest.spyOn(app, 'set');
      require('../bin/www');
      expect(appSetSpy).toHaveBeenCalledWith('port', parseInt(port, 10));
    });
  });
});
