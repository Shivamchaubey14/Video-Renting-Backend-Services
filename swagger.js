const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movie Rental API',
            version: '1.0.0',
            description: 'Professional Movie Rental API Documentation'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },

    apis: [
        './routes/*.js'
    ]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;