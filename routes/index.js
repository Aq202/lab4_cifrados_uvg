import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import userRouter from '../apiServices/user/user.route.js';
import fileRouter from '../apiServices/file/file.route.js';
import keyRouter from '../apiServices/key/key.route.js';
import consts from '../utils/consts.js';

const router = express.Router();

const { apiPath } = consts;

// Obtener __dirname del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Subir hasta la raíz del proyecto
const rootDir = path.resolve(__dirname, '../');


console.log(rootDir)
console.log(`${rootDir}\\public\\index.html`)
router.use(`${apiPath}/user`, userRouter);
router.use(`${apiPath}/file`, fileRouter);
router.use(`${apiPath}/key`, keyRouter);

router.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'index.html'));
});

export default router;
