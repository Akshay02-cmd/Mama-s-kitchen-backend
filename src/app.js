import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routers/auth.routers.js';

dotenv.config();

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to Mama\'s Kitchen API');
});

app.use('/auth', authRouter);

export default app;