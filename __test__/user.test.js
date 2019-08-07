const request = require('supertest');
const app = require('../index');

const fakeID = 'xxxxxxxxxxxx';
const validID = '5d4a5fc81787c69023eeca8e';

const reqBody = {
  menteeId: '986876878687876878'
};

describe('Make request End Point', () => {
  test('Returns 404 if post is made without an id', () => {
    return request(app)
      .post('/api/v1/users/request')
      .expect(200, {
        statusCode: 404,
        message: 'Not found',
        payload: null
      });
  });
  test('Returns 404 if request is made with wrong ID', () => {
    return request(app)
      .post(`/api/v1/users/request/${fakeID}`)
      .expect(200, {
        statusCode: 404,
        message: 'Schedule not found'
      });
  });
  test('Returns 404 if request has already been made', async () => {
    const response = await request(app)
      .post(`/api/v1/users/request/${validID}`)
      .set('Application', 'application/json')
      .send(reqBody)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toBe('request already made');
  });

});
