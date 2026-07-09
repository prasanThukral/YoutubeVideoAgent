import express from 'express';
const aiRouter = express.Router();
import { AgenticAPI } from '../controller/main.js';

aiRouter.post('/talk',AgenticAPI.talk)

export {aiRouter}
