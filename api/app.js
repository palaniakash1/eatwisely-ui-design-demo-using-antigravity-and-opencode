import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config.js';
import v1Routes from './routes/v1/index.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/live', (req, res) => {
  res.json({ status: 'alive' });
});

app.use('/api/v1', v1Routes);

app.use('/api', v1Routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(globalErrorHandler);

export default app;
