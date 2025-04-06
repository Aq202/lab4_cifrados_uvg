import express from 'express';
import { registerUser } from './user.controller.js';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('User route is working!');
});

userRouter.post('/register', registerUser);

export default userRouter;
