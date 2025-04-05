import mysql from 'mysql2';
import consts from '../utils/consts.js';

const connection = mysql.createConnection({
  host: consts.db.host,
  user: consts.db.user,
  password: consts.db.password,
  database: consts.db.name,
  port: consts.db.port,
});

export default connection;