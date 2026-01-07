import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.routers.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('Welcome to Mama\'s Kitchen API');
});

app.use('/auth', authRouter);

export default app;