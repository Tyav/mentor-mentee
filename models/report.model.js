const mongoose = require('mongoose');
const httpStstus = require('http-status')
const APIError = require('../helpers/APIError');



const Schema = mongoose.Schema;

const ReportSchema = new Schema ({
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
  takeaway: {
    type: String,
    default: '',
    maxlength: 500
  },
  comment: {
    type: String,
    default: '',
    maxlength: 500
  },
  deleted: {
    type: Boolean,
    default: false
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
ReportSchema.methods = {};

/**
 * statics
 */
ReportSchema.statics = {
  async getMany(option) {
    try {
      const reports = await this.find(option).exec();
      return reports;
    } catch (error) {
      throw new APIError({...error, isPublic: false});
    }
  },
  async get(id) {
    const report = await this.findOne({_id:id, deleted: false});
    return report;
  }
};

module.exports = mongoose.model("Report", ReportSchema);