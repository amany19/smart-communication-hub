import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
// import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(json());
// app.use(helmet());

// ✅ Log requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Mount all routes under /api
app.use('/api', routes);

// ✅ Health check endpoint
app.get('/', (_, res) => {
  res.status(200).json({ message: 'Server is running 🚀' });
});

export default app;
