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
const UserSchema = new mongoose.Schema(
  {
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
    skills: {
      type: [String],
      index: true
    },
    connection: {
      type: Map,
      of: String
    },
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
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

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
    const fields = [
      'id',
      'name',
      'email',
      'avatar',
      'isAdmin',
      'isMentor',
      'phone',
      'bio',
      'location',
      'connection',
      'skills',
      'deleted',
      'createdAt',
      'modifiedAt'
    ];
    return pick(fields, this);
  },
  // Generates user token
  token() {
    return EncodeToken(this.email, this._id, this.isAdmin, this.isMentor);
  }
};

UserSchema.statics = {
  /**
   *
   * @param {{}} options
   */
  async loginAndGenerateToken(options) {
    const { email, password } = options;
    if (!email) {
      throw new APIError({
        message: 'An email is required to generate a token'
      });
    }

    const user = await this.getByEmail(email);
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect username or password';
    }
    throw new APIError(err);
  },
  /**
   *
   * @param {String} email
   * @returns {Promise<UserSchema, APIError>}
   */
  async getByEmail(email) {
    let user = await this.findOne({
      email,
      deleted: false
    }).exec();
    return user;
  },
  async get(id) {
    try {
      const user = await this.findById(id).exec();
      if (user) {
        return user;
      }
      return user;
    } catch (error) {
      throw new APIError(error);
    }
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
