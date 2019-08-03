const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'MentorDev',
      version: '1.0.0',
      description: 'MentorDev API Documentation',
      contact: {
        email: 'tyav2greenz@gmail.com',
      },
    },
    tags: [
      {
        name: 'User',
        description: 'Everything about the Users API',
      },
      {
        name: 'Schedule',
        description: 'Everything about the Documents API',
      },
      {
        name: 'Forgot Password',
        description: 'Everything about the Roles API',
      },
      {
        name: 'Request',
        description: 'Everything about the Categories API',
      },
    ],
    schemes  : [ 'https', 'http' ],
    // host     : ['localhost:6060/'],  
    servers: [
      {url: 'localhost:6060', description: 'sdds'}
    ],

  },

  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./swagger-files/*.yaml'],
};

const specs = swaggerJsdoc(options);

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};