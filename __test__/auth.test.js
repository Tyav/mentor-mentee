const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

describe('#LOGIN TEST', () => {
  let user = new User({
    name: 'testMentor2',
    email: 'mentor@test.com',
    password: 'mentorpass',
    isMentor: true
  });

  beforeAll(async () => {
    await user.save();
  });
  afterAll(async () => {
    await User.deleteMany();
  });

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
   

      let userObject = {
        email: 'mentor@test.com',
        password: 'mentorpass'
      };

      return request(app)
        .post('/api/v1/auth/login')
        .send(userObject)
        .expect(200, {});
    });
  });
});
