const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    openapi: '3.0.0',
    info: {
      title: 'MentorDev',
      version: '1.0.0',
      description: 'MentorDev API Documentation',
      contact: {
        email: 'tyav2greenz@gmail.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    tags: [
      {
        name: 'User',
        description: 'Everything about the Users API',
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
        name: 'Contact',
        description: 'Edit user profile',
      },
    ],

    schemes: ['http', 'https'],
    host: ['localhost:6060/'],
    servers: [{ url: 'http://localhost:6060', description: 'development api' },{
      "url": "https://{baseUrl}:{port}/",
      "description": "The production API server",
      "variables": {
        "baseUrl": {
          "default": "localhost",
          "description": "this value is assigned by the service provider, in this example `gigantic-server`"
        },
        "port": {
          "enum": [
            "6060",
            "443"
          ],
          "default": "6060"
        },
      }
    },],
  },

  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./swagger-files/*.yaml'],
};

const specs = swaggerJsdoc(options);

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
