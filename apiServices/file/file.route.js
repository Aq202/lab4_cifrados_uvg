import express from 'express';

const fileRouter = express.Router();

fileRouter.get('/', (req, res) => {
    res.send('File route is working!');
});

export default fileRouter;
