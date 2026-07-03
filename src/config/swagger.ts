import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@config/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${config.appName} API Documentation`,
      version: config.appVersion,
      description: 'API documentation for Driver Logistics Mobile Application',
      contact: {
        name: 'Support Team',
        email: 'support@driverlogistics.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Development Server',
      },
      {
        url: 'https://api.driverlogistics.com/api',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    './src/modules/auth/auth.routes.ts',
    './src/modules/pickup/pickup.routes.ts',
    './src/modules/delivery/delivery.routes.ts',
    './src/modules/attendance/attendance.routes.ts',
    './src/modules/trip/trip.routes.ts',
    './src/modules/profile/profile.routes.ts',
    './src/modules/file/file.routes.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
