const request = require('supertest');
const app = require('../index');

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
});
// let schedule = {
//     day: 'Tuesday',
//     time: {
//         from: Date.now(),
//         to: Date(),
//     },
//     slot: 5,
//     isClosed: ()=> {return this.slot <= this.mentees.length},
//     mentorId: 'sdsdfd',
//     mentees: []

// }

// let request = {
//     menteeId: 'sdss',
//     scheduleId: 'sdfsds',
//     requestMessage: 'please acept me',
//     reponseMessage: '',
//     status: 'pending' || 'approved' || 'rejected',
// }
