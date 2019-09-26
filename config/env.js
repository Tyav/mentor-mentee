const { Joi } = require('celebrate');


// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();
// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number().default(6060),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  JWT_EXPIRATION_INTERVAL: Joi.string()
    .required()
    .description('JWT_EXPIRATION_INTERVAL required to sign'),
  MONGO_HOST: Joi.string()
    .required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  C_SECRET_ACCESS_KEY: Joi.string()
    .required()
    .description('Cloudinary secret access key'),
  C_ACCESS_KEY_ID: Joi.string()
    .required()
    .description('Cloudinary access key'),
  C_CLOUD_NAME: Joi.string()
    .required()
    .description('Cloudinary cloud name'),
  CLIENT_SIDE_URL: Joi.string().required().description('Mentordev client-side URL'),
  MENTOR_DEV_EMAIL: Joi.string().required().description('Official email for mentordev'),
  MENTOR_GIT_ID: Joi.string().required().description('Git Oauth client id for mentor'),
  MENTOR_GIT_SECRET: Joi.string().required().description('Git Oauth secret key for mentor'),
  MENTEE_GIT_ID: Joi.string().required().description('Git Oauth client id for mentee'),
  MENTEE_GIT_SECRET: Joi.string().required().description('Git Oauth secret key for mentee')
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpirationInterval: envVars.JWT_EXPIRATION_INTERVAL,
  mongo: {
    host: process.env.NODE_ENV === 'test' ? envVars.MONGO_HOST_TEST : envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
  cloudinary : {
    secretAccessKey: envVars.C_SECRET_ACCESS_KEY,
    accessKeyId: envVars.C_ACCESS_KEY_ID,
    cloud: envVars.C_CLOUD_NAME,
  },
  clientSideUrl: envVars.CLIENT_SIDE_URL,
  mentordev_email: envVars.MENTOR_DEV_EMAIL,
  gitAuth: {
    mentor_id: envVars.MENTOR_GIT_ID,
    mentor_secret: envVars.MENTOR_GIT_SECRET,
    mentee_id: envVars.MENTEE_GIT_ID,
    mentee_secret: envVars.MENTEE_GIT_SECRET
  }
};

module.exports = config;
