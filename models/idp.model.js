const mongoose = require('mongoose');
const httpStstus = require('http-status');
const APIError = require('../helpers/APIError');

const Schema = mongoose.Schema;

const IdpSchema = new Schema(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    mentee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      maxlength: 50,
      required: true,
    },
    goal: {
      type: String,
      default: '',
      maxlength: 500,
    },
    deadline: {
      type: Date,
      required: true,
    },
    outcome: {
      type: String,
      default: '',
      maxlength: 500,
    },
    comment: {
      type: String,
      default: '',
      maxlength: 500,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    isTied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

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
  async getMany(option) {
    try {
      const idps = await this.find(option).exec();
      return idps;
    } catch (error) {
      throw new APIError({ ...error, isPublic: false });
    }
  },
  async get(id) {
    const idp = await this.findOne({ _id: id, deleted: false });
    return idp;
  },
};

module.exports = mongoose.model('Idp', IdpSchema);
