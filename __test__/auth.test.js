const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

describe('#LOGIN TEST', () => {
  let user = new User({
    name: 'oke tega',
    email: 'mike@gmail.com',
    password: 'xxxxxxxxxxxxxxxxx',
    isMentor: true
  });

  user.save();

  // let token = user.generateToken();

  let userTwo = new User({
    name: 'testMentor2',
    email: 'mentor@test.com',
    password: 'mentorpass',
    isMentor: true
  });

  //i am creating this user to test the "verified" functionality
  // const userThree = new User({
  // name: 'testUserVerification',
  // email: 'testuser@gmail.com',
  // password: 'testingverificationpass',
  // isMentor: false
  // });

  let useThreeToken;

  beforeAll(async () => {
    await userTwo.save();
    // await userThree.save();
    request(app)
      .post('/user')
      .send({
        name: 'testUserVerification',
        email: 'testuser@gmail.com',
        password: 'testingverificationpass',
        isMentor: false
      })
      .end((err, response) => {
        useThreeToken = response.body.token; // save the token!
        done();
      });
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
  });

  // the test for verified user comes in <here className="">
  describe('#VERIFY', () => {
    console.log('hello boooo')
    it('should return the user object back', () => {
      return request(app)
        .get('/verify')
        .set('Authorization', `Bearer ${useThreeToken}`)
        .then(response => {
          console.log('hhhajlsdfjasdfasd')
          console.log(response)
          expect(response.statusCode).toBe(200);
          expect(response.type).toBe('application/json');
          
        });
    });
  });
});
