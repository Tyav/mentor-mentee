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
describe('test /api/v1/users endpoint', () => {
  test('POST to /api/v1/users respond with 400 email is required', async () => {
    let data = {
      // no name
      name: 'dummy dummy',
      //   email: 'dummy@gmail.com',
      password: 'password',
      isMentor: 'false'
    };
    const response = await request(app)
      .post('/api/v1/users')
      .send(data)
      .expect(200);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.payload).toBe(null);
    expect(response.body.error).toBe('"email" is required');
  });

  test('POST to /api/v1/users should create a new user and return token as payload', async () => {
    let data = {
      // all fields supplied
      name: 'dummy dummy',
      email: 'dummy@gmail.com',
      password: 'password',
      isMentor: 'false'
    };
    const response = await request(app)
      .post('/api/v1/users')
      .send(data)
      .expect(200);
    expect(response.body.payload).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      isAdmin: expect.any(Boolean),
      isMentor: expect.any(Boolean)
    });
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.error).toBe(null);
    expect(response.body.token).toMatch(
      /^[a-z0-9-_=]*\.[a-z0-9-_=]*\.[a-z0-9-_.+=]*$/i
    );
  });

  test('POST to /api/v1/users respond with 400 email already in use', async () => {
    let data = {
      // no name
      name: 'dummy dummy',
      email: 'dummy@gmail.com',
      password: 'password',
      isMentor: 'false'
    };
    const response = await request(app)
      .post('/api/v1/users')
      .send(data)
      .expect(200);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.payload).toBe(null);
    expect(response.body.error.msg).toBe('Email already in use!');
  });
});
