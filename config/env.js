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
  AWS_SECRET_ACCESS_KEY: Joi.string()
    .required()
    .description('AWS secret access key'),
  AWS_ACCESS_KEY_ID: Joi.string()
    .required()
    .description('AWS access key')
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
  AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID
};

module.exports = config;
