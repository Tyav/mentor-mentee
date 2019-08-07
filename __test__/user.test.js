const request = require('supertest');
const app = require('../config/express');
const User = require('../models/user.model');

describe('Testing User router', () => {
  describe('Testing Image Upload', () => {
    it('Should be able to upload an image', done => {
      return request(app)
        .put('/api/v1/users/:id/images')
        .expect('Content-Type', /json/)
        .expect(200, done());
    });
  });
  describe('PUT request to /users/:id to update user Profile', () => {
    const realData = {
      name: 'Omolayo Victor',
      email: 'remymartins@gmail.com',
      phone: '08060347977',
      connection: {
        twitter: 'kingkonsole',
        github: 'iknowjavascript'
      },
      bio: 'One badass Software Engineer',
      location: 'Lagos Nigeria',
      skills: ['Git', 'JavaScript', 'React']
    };

    const fakeData = {
      name: 'Omolayo Victor',
      email: '',
      phone: '080',
      bio: 'One badass Software Engineer',
      location: 'Lagos Nigeria',
      skills: ['Git', 'JavaScript', 'React']
    };
    it('Post request to /users/:userId should return error if data is not valid', done => {
      return request(app)
        .put(`/api/v1/users/12345`)
        .send(fakeData)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.payload).toBe(null);
          expect(res.body.error).toBeDefined();

          done();
        });
    });

    it('Post request to /users/:userId with invalid userId should return error', done => {
      return request(app)
        .put('/api/v1/users/2341')
        .send(fakeData)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.payload).toBe(null);
          expect(res.body.error).toBeDefined();

          done();
        });
    });

    it('Post request to /users/:userId, Valid data and Id should be successful', async done => {
      let user = new User({
        name: 'testuser',
        email: 'test@test.com',
        password: 'testpass'
      });

      await user.save();

      return request(app)
        .put(`/api/v1/users/${user._id}`)
        .send(realData)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.status).toBe(200);
          done();
        })
        .catch(err => console.log(err));
    }, 10000);
  });
});

describe('Testing Image Upload', () => {
  it('Should be able to upload an image', done => {
    request(app)
      .put('/api/v1/users/:userId/images')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

