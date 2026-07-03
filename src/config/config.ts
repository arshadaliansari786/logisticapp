import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  appName: process.env.APP_NAME || 'Driver Logistics API',
  appVersion: process.env.APP_VERSION || '1.0.0',

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
    expiryTime: process.env.JWT_EXPIRY || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    refreshExpiryTime: process.env.JWT_REFRESH_EXPIRY || '30d',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png').split(','),
    allowedDocumentTypes: (process.env.ALLOWED_DOCUMENT_TYPES || 'application/pdf').split(','),
  },

  // CORS Configuration
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  },

  // OTP Configuration
  otp: {
    expiry: parseInt(process.env.OTP_EXPIRY || '600'),
    length: parseInt(process.env.OTP_LENGTH || '6'),
  },

  // Swagger Configuration
  swagger: {
    path: process.env.SWAGGER_PATH || '/api-docs',
  },

  // Database is configured via Prisma
  database: {
    url: process.env.DATABASE_URL || '',
  },
};

export default config;
