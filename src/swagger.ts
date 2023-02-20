import swaggerJSDoc from 'swagger-jsdoc';

import createConfig from './config';

async function createSwagger() {
  const config = await createConfig();
  const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
      info: {
        title: 'Example API',
        version: '1.0.0',
        description: 'A sample API for demonstration purposes',
      },
      host: `${config.server.host}:${config.server.port}`,
      schemes: [config.server.protocol],
      basePath: '/',
    },
    apis: [
      './src/router.ts',
    ],
  });
  return swaggerSpec;
}

export default createSwagger;
