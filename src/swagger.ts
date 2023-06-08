import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'NarsDogCatAPI',
            version: '1.0.0',
            description: 'API for the narsdogcats website ',
        },
        servers: [
            {
                url: 'http://localhost:3300',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization'
                }
            }
        }
    },
    apis: ['./src/routes/*.ts'], // this would be the path where your route files are
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;