import express from 'express';
import { meal } from '../controllers/meal.controller.js';

const router = express.Router();
router.route('/').get(meal);

export default router;