const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
/*
======= Create function mocks ========
*/
//mock mail formater to return only the token
jest.mock('../helpers/mailMessage.js');
const mailFormatter = require('../helpers/mailMessage.js')
mailFormatter.forgotPassword.mockImplementation(token=> token)

// mock sendMail
jest.mock('../helpers/SendMail.js');
const sendMail = require('../helpers/SendMail.js');
let mailData = {}
sendMail.mockImplementation((email, subject, message) => {
  mailData = {
    email, subject, message
  }
})

/* End of function mocks
*/
describe('#LOGIN TEST', () => {
  let user = new User({
    name: 'oke tega',
    email: 'mike@gmail.com',
    password: 'xxxxxxxxxxxxxxxxx',
    isMentor: true,
    isVerified: true
  });


  let token = user.token();

  let userTwo = new User({
    name: 'testMentor2',
    email: 'mentor@test.com',
    password: 'mentorpass',
    isMentor: true,
    isVerified: true
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
    await user.save();

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
        //done();
      });
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  describe('LOGIN', () => {
    it('should return invalid name or password if a wrong email is passed in', () => {
      const incorrectEmail = {
        email: 'rukeeojigbo@gmail.com',
      };
      return request(app)
        .post('/api/v1/auth/login')
        .send(incorrectEmail)
        .expect(200, {
          statusCode: 400,
          message: 'Invalid fields',
          payload: null,
          errors: { password: 'password is required' }
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
          statusCode: 401,
          message: 'Incorrect email or password',
          payload: null,
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
        .expect(200)
        .then((response)=>{
          expect(response.body.token).toBeDefined()
        });
    });

    describe('Forgot Password Endpoint #/auth/forgot-password', () => {
      // test('Should check if there is a /auth/forgot endpoint', () => {
      //   return request(app)
      //     .post('/api/v1/auth/forgot')
      //     .send({email: 'no'})
      //     .expect('Content-Type', /json/)
      //     .expect(200, {
      //       statusCode: 404,
      //       message: 'A link to reset your password has been sent to your email.'
      //     });
      // });
      test('Returns 404 if user is not found', () => {
        const body = { email: 'xxxxxxxxx@test.com' };
        return request(app)
          .post('/api/v1/auth/forgot-password')
          .set('Accept', 'application/json')
          .send(body)
          .expect('Content-Type', /json/)
          .expect(200, {
            statusCode: 404,
            message: 'A link to reset your password has been sent to your email.'
          });
      });
      test('Returns 200 if mail was sent', async () => {
        const reqBody = { email: 'mike@gmail.com' };
        const response = await request(app)
          .post('/api/v1/auth/forgot-password')
          .set('Accept', 'application/json')
          .send(reqBody)
          .expect('Content-Type', /json/)
          .expect(200);
          console.log(response.body)
        expect(response.body.statusCode).toBe(200);
      });
    });

    describe('Reset Password Endpoint #/auth/reset-password', () => {
      // test('Should check if there is a /auth/reset endpoint', () => {
      //   return request(app)
      //     .get('/api/v1/auth/reset')
      //     .expect(200, {
      //       statusCode: 404,
      //       message: 'There is no token attached to this request'
      //     });
      // });
      test('Returns 401 if post is made without a token', () => {
        return request(app)
          .post('/api/v1/auth/reset-password')
          .send({password: 'reterdferdfdf'})
          .expect(200, {
            statusCode: 401,
            message: 'Unauthorized',
            payload: null
          });
      });
      test('Returns 400 if post is made with invalid token', () => {
        tokens = 'xxxxxxxxxxxxxxxx';
        return request(app)
          .post(`/api/v1/auth/reset-password`)
          .set('Authorization', `Bearer ${tokens}`)
          .send({password: 'reterdferdfdf'})
          .expect(200, {
            statusCode: 400,
            message: 'Token may have expired',
            payload: null
          });
      });
      test('Returns 404 if a valid token is provided but no body sent', () => {
        return request(app)
          .post(`/api/v1/auth/reset-password`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200, {
            statusCode: 400,
            message: 'Invalid fields',
            errors: { password: 'password is required' },
            payload: null
          });
      });
      test('Returns 200 if a valid token and body is provided', async () => {
        const body = {
          password: 'theusersnewpassword'
        };
        console.log(mailData)
        const response = await request(app)
          .post(`/api/v1/auth/reset-password`)
          .set('Authorization', `Bearer ${mailData.message}`)
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
    it('should return the user object back', () => {
      return request(app)
        .get('/verify')
        .set('Authorization', `Bearer ${useThreeToken}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.type).toBe('application/json');
        });
    });
  });
});
