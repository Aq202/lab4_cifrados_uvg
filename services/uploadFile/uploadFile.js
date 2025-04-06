import multer from 'multer';
import storage from './storage.js';
import consts from '../../utils/consts.js';

const limits = {
  fileSize: consts.uploadFileSizeLimit,
};

export default multer({ storage, limits });
