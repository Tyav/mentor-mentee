const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
const Schedule = require('../models/schedule.model')

describe('# SCHEDULES TEST', () => {
  let user = new User({
    name: 'testMentor',
    email: 'mentor@test.com',
    password: 'mentorpass',
    isMentor: true
  })
  beforeAll(async () => {
    await user.save()
  })
  afterAll (async ()=>{
    await User.deleteMany();
    await Schedule.deleteMany();
  })

  describe('POST /api/v1/schedules  #Create Schedules', () => {
    console.log('hey');
    it('should return the post...', () => {
      const newSchedule = {
        day: 'thursday',
        time: {
          from: '27-10-2019',
          to: '28-10-2019'
        },
        slot: 4,
        mentorId: user._id
      };
    
      return request(app)
        .post('/api/v1/schedules')
        .send(newSchedule)
        .expect(200).then((res)=> {
          console.log(user)
          console.log(res.body.payload.mentorId)
          // expect(res.body.payload.mentorId).toEqual(user._id)
          expect(res.body.payload.mentorId).toBe(user._id.toString())
          // done()
        });
    });
  });
});
