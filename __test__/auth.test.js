const request = require('supertest');

const User = require('../models/user.model');

const app = require('../index');

let user = new User({
  name: 'oke tega',
  email: 'mike@gmail.com',
  password: 'xxxxxxxxxxxxxxxxx',
  isMentor: true
});
user.save();
let token = user.generateToken();

afterAll(() => {
  return User.deleteOne({ email: 'mike@gmail.com' });
});

describe('Forgot Password Endpoint', () => {
  test('Should check if there is a /auth/forgot endpoint', () => {
    return request(app)
      .post('/api/v1/auth/forgot')
      .expect('Content-Type', /json/)
      .expect(200, {
        statusCode: 404,
        message: 'email success message'

      });
  });
  test('Returns 404 if user is not found', () => {
    const body = { email: 'xxxxxxxxx@xxxxx.xxx' };
    return request(app)
      .post('/api/v1/auth/forgot')
      .set('Accept', 'application/json')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200, {
        statusCode: 404,

        message: 'email success message'
      });
  });
  test('Returns 200 if mail was sent', async () => {
    const reqBody = { email: 'mike@gmail.com' };
    const response = await request(app)
      .post('/api/v1/auth/forgot')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.statusCode).toBe(200);

  });
});

describe('Reset Password Endpoint', () => {
  test('Should check if there is a /auth/reset endpoint', () => {
    return request(app)
      .get('/api/v1/auth/reset')
      .expect(200, {
        statusCode: 404,
        message: 'There is no token attached to this request'
      });
  });
  test('Returns 404 if post is made without a token', () => {
    return request(app)
      .post('/api/v1/auth/reset')
      .expect(200, {
        statusCode: 404,
        message: 'There is no token attached to this request'
      });
  });
  test('Returns 404 if post is made with invalid token', () => {
    const token = 'xxxxxxxxxxxxxxxx';
    return request(app)
      .post(`/api/v1/auth/reset/${token}`)
      .expect(200, {
        statusCode: 404,
        message: 'Token may have expired'
      });
  });
  test('Returns 404 if a valid token is provided but no body sent', () => {
    return request(app)
      .post(`/api/v1/auth/reset/${token}`)
      .expect(200, {
        statusCode: 404,
        message: 'Password reset token is invalid or has expired'
      });
  });
  test('Returns 200 if a valid token and body is provided', async () => {
    const body = {
      password: 'theusersnewpassword'
    };

    const response = await request(app)
      .post(`/api/v1/auth/reset/${token}`)
      .set('Application', 'application/json')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.message).toBe('Password has been changed');
  });
});
