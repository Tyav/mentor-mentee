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
        email: 'tyav2greenz@gmail.com'
      },
      license: {
        "name": "Apache 2.0",
        "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
      },
    },
    tags: [
      {
        name: 'User',
        description: 'Everything about the Users API'
      },
      {
        name: 'Schedule',
        description: 'Everything about the Schedule API',
      },
      {
        name: 'Forgot Password',
        description: 'Everything about the Password API',
      },
      {
        name: 'Request',
        description: 'Everything about the Request API',
      },
      {
        name: 'Profile',
        description: 'Edit user profile'
      }
    ],

    schemes  : [ 'http', 'https' ],
    host     : ['localhost:6060/'],  
  },
  servers : [
    {url: 'http://localhost:6060', description: ''}
  ],


  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./swagger-files/*.yaml']
};

const specs = swaggerJsdoc(options);

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
