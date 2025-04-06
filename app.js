import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.js';
import { connection } from './db/connection.js';

const app = express();

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos.', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa.');
});

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.use('/', indexRoutes);

export default app;
