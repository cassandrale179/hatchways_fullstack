const globals = require('@jest/globals');
const request = require('supertest');
const { app } = require('../app');
const { makeToken } = require('./utils');

const { describe, it, expect } = globals;

// ---------------------------------------------------------------- //
//                                                                  //
//                 PLEASE DO NOT MODIFY THIS FILE.                  //
//               Hatchways automation depends on it.                //
//                                                                  //
// ---------------------------------------------------------------- //

describe('POST /api/onboarding', () => {
  it('should allow onboarding form request from thomas.', async () => {
    const token = makeToken(1);
    const res = await request(app)
      .post('/api/onboarding')
      .set('x-access-token', token)
      .send({
        steps: [
          [
            {
              name: 'firstName',
              value: 'Thomas',
            },
            {
              name: 'lastName',
              value: 'Smith',
            },
            {
              name: 'country',
              value: 'Canada',
            },
            {
              name: 'bio',
              value: 'This is my bio.',
            },
          ],
          [
            {
              name: 'receiveNotifications',
              value: false,
            },
            {
              name: 'receiveUpdates',
              value: true,
            },
          ],
        ],
      });
    
    expect(res.body.firstName).toEqual('Thomas');
    expect(res.body.lastName).toEqual('Smith');
    expect(res.body.country).toEqual('Canada');
    expect(res.body.bio).toEqual('This is my bio.');
    expect(res.body.receiveNotifications).toEqual(false);
    expect(res.body.receiveUpdates).toEqual(true);
    expect(res.status).toEqual(200);
  });
});
