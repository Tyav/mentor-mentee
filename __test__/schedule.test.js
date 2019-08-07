const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

describe('CREATE SCHEDULE', () => {
  console.log('hey');
  it('should return the post...', () => {
    const newSchedule = {
      day: 'thursday',
      time: {
        from: '27-10-2019',
        to: '28-10-2019'
      },
      slot: 4,
      mentorId: 'string fr mentor'
    };
    console.log(newSchedule, 'your brother');
    return request(app)
      .post('/api/v1/schedules')
      .send(newSchedule)
      .expect(200, {
        statusCode: 200,
        message: 'Schedule Created',
        payload: {
          isClosed: false,
          mentees: [],
          _id: '5d4a73b365447a080c462f21',
          day: 'thursday',
          time: {
            from: '2019-08-07T06:46:11.000Z',
            to: '2019-08-07T06:46:11.000Z'
          },
          slot: 4,
          mentorId: 'string fr mentor'
        },
        error: null
      });
  });
});
