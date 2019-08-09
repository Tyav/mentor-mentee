const mongoose = require('mongoose');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status')

const RequestSchema = new mongoose.Schema({
  mentee: { 
    type: mongoose.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  schedule: { 
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Schedule'
  },
  message: {
    type: String,
    maxlength: 250,
  },
  response: {
    type: String,
    maxlength: 250,
  },
  status : {
    type : String,
    enum : ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
});

RequestSchema.methods = {

}

RequestSchema.statics ={
  async get(id) {
    try {
      return await this.findById(id)
    } catch (error) {
      throw new APIError({message: error.message, status: httpStatus.BAD_REQUEST})
    }
  }
}


module.exports = mongoose.model('Request', RequestSchema);
