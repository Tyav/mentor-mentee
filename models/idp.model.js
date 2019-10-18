const mongoose = require('mongoose');
const APIError = require('../helpers/APIError');



const Schema = mongoose.Schema;

const IdpSchema = new Schema ({
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: String,
    default: '',
    maxlength: 500
  },
  plan: {
    type: String,
    default: '',
    maxlength: 500
  },
  outcome: {
    type: String,
    default: '',
    maxlength: 500
  },
  result: {
    type: String,
    default: '',
    maxlength: 500
  },
  comment: {
    type: String,
    default: '',
    maxlength: 500
  }
}, { timestamps: true });

/**
 * Create hooks
 * IdpSchema.pre( '<hook name>', callback)
 */

/**
 * methods
 * 
 */
IdpSchema.methods = {};

/**
 * statics
 */
IdpSchema.statics = {
  async get(option) {
    try {
      const idp = await this.find(option).exec();
      return idp;
    } catch (error) {
      throw new APIError({...error, isPublic: false});
    }
  }
};

module.exports = mongoose.model("Idp", IdpSchema);