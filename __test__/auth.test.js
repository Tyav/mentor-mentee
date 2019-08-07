const request = require('supertest');

const app = require('../index');

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjU5NzQ1ODUsImlhdCI6MTU2NTExMDU4NSwic3ViIjoiNWQ0OTU1MWRkNjQ4ODhjOTYzNmMwZjI1IiwiZW1haWwiOiJva2V0ZWdhaEBnbWFpbC5jb20ifQ.Fd5NhXaalDNhv_8wAMX3hsSI0tcApE-t6-wrU7cciTg';

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
  test('Returns 200 if mail was sent', () => {
    const reqBody = { email: 'oketegah@gmail.com' };
    return request(app)
      .post('/api/v1/auth/forgot')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect('Content-Type', /json/)
      .expect(200, {
        statusCode: 200,
        message: 'Successfully sent reset mail'
      });
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
      .expect(200, { statusCode: 404, message: 'Token may have expired' });
  });
  test('Returns 200 if a valid token and body is provided', () => {
    const body = {
      password: 'theusersnewpassword'
    };
    return request(app)
      .post(`/api/v1/auth/reset/${token}`)
      .set('Application', 'application/json')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200, {
        statusCode: 200,
        message: 'Password has been changed'
      });
  });
});
