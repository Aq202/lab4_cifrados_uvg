import express from 'express';
import { generateKeyPair } from './key.controller.js';

const keyRouter = express.Router();

keyRouter.get('/', (req, res) => {
  res.send('Key route is working!');
});

keyRouter.post('/generate', generateKeyPair);

export default keyRouter;