/**
 * @fileoverview Express application configuration and middleware setup
 * @module app
 * @requires express
 * @requires dotenv
 * @requires cookie-parser
 * @requires ./routes/auth.routes
 * @requires ./routes/profile.routes
 * @requires ./routes/mess.routes
 */

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import profileRouter from  './routes/profile.routes.js';
import messRouter from './routes/mess.routes.js';

dotenv.config();

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('Welcome to Mama\'s Kitchen API');
});

app.use('/auth', authRouter);  
app.use('/profile',profileRouter);
app.use('/mess', messRouter);
app.use('/contacts',(req, res) => {
  res.send('Contacts endpoint is under construction');
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send('Endpoint not found');
});

export default app;