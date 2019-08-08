const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pick = require('ramda/src/pick');
const APIError = require('../helpers/APIError');
const EncodeToken = require('../helpers/tokenEncoder');
const config = require('../config/env');
const getAvatar = require('../helpers/avatar');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  phone: {
    type: String,
    minlength: 8,
    maxlength: 13
  },
  bio: {
    type: String,
    minlength: 2,
    maxlength: 250
  },
  location: {
    type: String
  },
  skills: { type: [String], index: true },
  connection: {},
  isMentor: {
    type: Boolean,
    required: true,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: getAvatar(this.email)
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.pre('save', function(next) {
  /**
   * Ensures the password is hashed before save
   */
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

/**
 * Methods
 * write reusable methods here
 */
UserSchema.methods = {
  /**
   * checks if password is valid
   * @param {String} password - input password
   */
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
  /**
   * Returns user object without password
   */

  transform() {
    // add feilds to be selected
    const fields = ['id', 'name', 'email', 'isAdmin', 'isMentor', 'phone', 'bio', 'location', 'skills'];
    return pick(fields, this);
  },
  async generateToken() {
    // generate token
    let { _id, email, isAdmin, isMentor } = this;
    // sign a jwt token

    return await EncodeToken(_id, email, isAdmin, isMentor);
  }
};

UserSchema.statics = {
  /**
   *
   * @param {String} email
   * @returns {Promise<UserSchema, APIError>}
   */
  async getByEmail(email) {
    let user = this.findOne({
      email
    }).exec();
    return user;
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
