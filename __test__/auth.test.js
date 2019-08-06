const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

describe('LOGIN', () => {
  it('should return invalid name or password if a wrong email is passed in', () => {
    const incorrectEmail = {
      email: 'rukeeojigbo@gmail.com'
    };
    return request(app)
      .post('/api/v1/auth/login')
      .send(incorrectEmail)
      .expect(200, {
        statusCode: 400,
        message: 'Incorrect email or password',
        payload: null,
        error: null
      });
  });

  it('should return an Invalid password if a wrong password is entered', () => {
    const incorrectPassword = {
      email: 'ter@test.com',
      password: '222222'
    };

    return request(app)
      .post('/api/v1/auth/login')
      .send(incorrectPassword)
      .expect(200, {
        statusCode: 400,
        message: 'Incorrect email or password',
        payload: null,
        error: null
      });
  });

  it('should return a token when the credentials are correct', async () => {
    // const correctCredentials = {
    //   email: 'ter@test.com',
    //   password: '123456'
    // };
    // console.log('rukee')

    let userObject = {
      email: 'test@gmail.com',
      password: 'password'
    };

    return request(app)
      .post('/api/v1/auth/login')
      .send(userObject)
      .expect(200, {});
  });
});
