import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth/auth.routers.js';
import mealRouter from './routers/meals/mealinfo.routers.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('Welcome to Mama\'s Kitchen API');
});

app.use('/auth', authRouter);
app.use('/meals', mealRouter);
app.use('/contacts',(req, res) => {
  res.send('Contacts endpoint is under construction');
});

export default app;