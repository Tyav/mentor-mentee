const request = require('supertest');
const app = require('../config/express');

describe('Testing Image Upload', () => {
  it('Should be able to upload an image', done => {
    request(app)
      .put('/api/v1/users/:userId/images')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

