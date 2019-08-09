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
  DO_SECRET_ACCESS_KEY: Joi.string()
    .required()
    .description('Digital Ocean secret access key'),
  DO_ACCESS_KEY_ID: Joi.string()
    .required()
    .description('Digital Ocean access key'),
  DO_BUCKET_NAME: Joi.string()
    .required()
    .description('Digital Ocean bucket'),
  DO_ENDPOINT: Joi.string()
  .required()
  .description('Digital Ocean space endpoint'),
  CLIENT_SIDE_URL: Joi.string().required().description('Mentordev client-side URL'),
  MENTOR_DEV_EMAIL: Joi.string().required().description('Official email for mentordev')
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
    host: process.env.NODE_ENV === 'development' ? envVars.MONGO_HOST : envVars.MONGO_HOST_TEST,
    port: envVars.MONGO_PORT
  },
  digiOcean : {
    secretAccessKey: envVars.DO_SECRET_ACCESS_KEY,
    accessKeyId: envVars.DO_ACCESS_KEY_ID,
    bucket: envVars.DO_BUCKET_NAME,
    endpoint: envVars.DO_ENDPOINT
  },
  clientSideUrl: envVars.CLIENT_SIDE_URL,
  mentordev_email: envVars.MENTOR_DEV_EMAIL
};

module.exports = config;
