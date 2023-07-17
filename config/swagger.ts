import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: 'docs', // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: '/swagger.json',

  middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

  options: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'CuboSuite API',
        version: '1.0.0',
        description: 'Documentação CuboCRM',
        contact: {
          email: 'contato@cubosuite.com.br',
        },
      },
      servers: [
        {
          url: 'https://api.cubosuite.com.br',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description:
              'Adicionar a palavra Bearer antes do seu token. Ex: Bearer xxxxxxxxxxxxxxxxxxxxxx',
          },
        },
      },
      security:{
        apiKey: []
      }
    },

    apis: ['app/**/*.ts', 'docs/swagger/**/*.yml', 'start/routes.ts'],
    basePath: '/',
  },
  mode: process.env.AMBIENT === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json',
} as SwaggerConfig
