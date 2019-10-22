const request = require('supertest');
const app = require('../index');
const Request = require('../models/request.model');

console.log(Request, 'hello rukee');

describe('#REQUEST', () => {
  const requestOne = new Request({
    schedule: '5d5404caa6d54b359495b7cd',
    message: 'it would be a privelege to have you as my mentor'
  });
  it('should behave...', () => {
    expect(true).toBe(true)
  });
  
});
