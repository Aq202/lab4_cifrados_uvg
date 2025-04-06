import express from 'express';
import { generateKeyPair } from './key.controller.js';
import authenticateToken from '../../middleware/auth.middleware.js';

const keyRouter = express.Router();

keyRouter.get('/', (req, res) => {
  res.send('Key route is working!');
});

keyRouter.post('/generate', authenticateToken, generateKeyPair);

export default keyRouter;