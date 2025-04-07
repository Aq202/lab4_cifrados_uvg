import express from 'express';
import multerMiddleware from '../../middlewares/multer.middleware.js';
import uploadFile from '../../services/uploadFile/uploadFile.js';
import {saveFileController} from './file.controller.js';
const fileRouter = express.Router();

fileRouter.post('/save', multerMiddleware(uploadFile.single('file')), saveFileController);

export default fileRouter;
