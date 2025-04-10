import { executeQuery } from "../../db/connection.js";
import CustomError from "../../utils/customError.js";

const saveFile = async ({ fileName, mimeType, fileContent, userId, hash}) => {

    const query = `
    INSERT INTO files (file_name, mime_type, content, user_id, hash)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        content = VALUES(content),
        hash = VALUES(hash),
        created_at = NOW()
    `;

    
    return await executeQuery(query, [fileName, mimeType, fileContent, userId, hash]);
}

const getFile = async (fileId) => {
    const query = `SELECT * FROM files WHERE id = ?`;
    const [result] = await executeQuery(query, [fileId]);

    if (!result[0]) return null;

    const row = result[0];

    return {
        id: row.id,
        fileName: row.file_name,
        mimeType: row.mime_type,
        content: row.content,
        userId: row.user_id,
        hash: row.hash,
        createdAt: row.created_at
    };
};

const getFiles = async() => {
    const query = `SELECT f.id, f.file_name, u.email, f.user_id, f.created_at FROM files f INNER JOIN user u ON f.user_id = u.id`;
    const [result] = await executeQuery(query, []);

    if (!result[0]) return null;

    const rows = result.map((row) => ({
        id: row.id,
        fileName: row.file_name,
        author: row.email,
        authorId: row.user_id,
        createdAt: row.created_at
    }));

    return rows;
}

const getFileByName = async (fileName, userId) => {
    const query = `
    SELECT * FROM files f
    WHERE f.file_name = ? AND f.user_id = ?`;
    const [result] = await executeQuery(query, [fileName, userId]);

    if (!result[0]) return null;

    const row = result[0];

    return {
        id: row.id,
        fileName: row.file_name,
        mimeType: row.mime_type,
        content: row.content,
        userId: row.user_id,
        hash: row.hash,
        createdAt: row.created_at
    };
};


export { saveFile, getFile, getFiles, getFileByName };