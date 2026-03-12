import mongoose from 'mongoose';
import app from './app.js';
import config from './config.js';
import { logger } from './utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.warn('MongoDB connection failed - server running in demo mode');
    logger.warn('To enable full functionality, please configure MongoDB');
  }
};

const startServer = async () => {
  setImmediate(() => {
    connectDB();
  });

  app.use((err, req, res, next) => {
    const { globalErrorHandler } = require('./middlewares/errorHandler.js');
    globalErrorHandler(err, req, res, next);
  });

  const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    logger.info(`API Documentation: http://localhost:${config.port}/api/docs`);
  });

  return server;
};

startServer();
