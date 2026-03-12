import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const isTest = env === 'test';

export { isTest };

export default {
  port: process.env.PORT || 3000,
  nodeEnv: env,
  env,
  isTest,
  appName: 'mern-restaurant',
  logLevel: process.env.LOG_LEVEL || 'info',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/restaurant',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '1h',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  redis: {
    url: process.env.REDIS_URL || null,
    cacheTtlSeconds: parseInt(process.env.CACHE_TTL || '300', 10),
    connectTimeoutMs: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '5000', 10)
  },
  cacheTtl: parseInt(process.env.CACHE_TTL || '300', 10),
  metricsToken: process.env.METRICS_TOKEN || null
};
