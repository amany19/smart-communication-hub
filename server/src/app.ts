import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
// import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

dotenv.config();

const app = express();

//  Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(json());
// app.use(helmet());
 
app.use(morgan("dev"));
 
app.use('/api', routes);

 
app.get('/', (_, res) => {
  res.status(200).json({ message: 'Server is running 🚀' });
});

export default app;
