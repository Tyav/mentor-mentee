const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
const Schedule = require('../models/schedule.model');

describe('# SCHEDULES TEST', () => {
  
  let user = new User({
    name: 'testMentor',
    email: 'mentor@test.com',
    password: 'mentorpass',
    isMentor: true,
    isVerified: true
  });
  beforeAll(async () => {
    await user.save();
  });
  afterAll(async () => {
    await User.deleteMany();
    await Schedule.deleteMany();
  });
  
  describe('POST /api/v1/schedule  #Create Schedules', () => {
    
    it('should return the post...', () => {
      const newSchedule = {
        day: 'Thursday',
        time: {
          from: '04:00',
          to: '11:00'
        },
        isClosed: false,
        slots: 4,
        isInstant: true,
      };
      return request(app)
        .post('/api/v1/schedule')
        .send(newSchedule)
        .set('Authorization', `Bearer ${user.token()}`)
        .expect(200)
        .then(res => {
          expect(res.body.payload.mentor).toBe(user._id.toString());
        });
    });
  });
});
