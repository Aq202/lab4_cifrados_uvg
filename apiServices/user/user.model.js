import { executeQuery } from '../../db/connection.js';

const createUser = async ({ email, passwordHash }) => {
    const query = 'INSERT INTO user (email, password) VALUES (?, ?)';
    const [result] = await executeQuery(query, [email, passwordHash]);
    return result.insertId;
};

const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    const [rows] = await executeQuery(query, [email]);
    return rows[0];
};

export {
    createUser,
    getUserByEmail,
}