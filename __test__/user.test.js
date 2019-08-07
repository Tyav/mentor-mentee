const request = require('supertest');
const app = require('../index');

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
    console.log('RESPONSE:', response.body);
    expect(response.body.statusCode).toBe(200);
    expect.stringMatching(/^[a-z0-9-_=]*\.[a-z0-9-_=]*\.[a-z0-9-_.+=]*$/i);
    expect(response.body.error).toBe(null);
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
