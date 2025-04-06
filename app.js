import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.js';
import { connection } from './db/connection.js';
import getDirname from './utils/getDirname.js';
import fs from 'fs';
import path from 'path';

const app = express();

global.dirname = getDirname(import.meta.url);

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos.', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa.');
});

// Verificar si existe el directorio /files, si no existe, crearlo
const filesDir = path.join(global.dirname, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.use('/', indexRoutes);

export default app;
