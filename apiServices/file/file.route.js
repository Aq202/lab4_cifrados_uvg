import express from 'express';
import multerMiddleware from '../../middlewares/multer.middleware.js';
import uploadFile from '../../services/uploadFile/uploadFile.js';
import {getFileController, saveFileController, verifyFileController} from './file.controller.js';
import authenticateToken from '../../middlewares/auth.middleware.js';

const fileRouter = express.Router();

fileRouter.post('/save',authenticateToken, multerMiddleware(uploadFile.single('file')), saveFileController);
fileRouter.get('/:fileId', getFileController);
fileRouter.post('/verify',authenticateToken, multerMiddleware(uploadFile.single('file')), verifyFileController);

export default fileRouter;
