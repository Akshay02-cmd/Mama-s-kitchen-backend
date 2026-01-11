import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import profileRouter from  './routes/profile.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('Welcome to Mama\'s Kitchen API');
});

app.use('/auth', authRouter);  
app.use('/profile',profileRouter);
app.use('/contacts',(req, res) => {
  res.send('Contacts endpoint is under construction');
});

export default app;