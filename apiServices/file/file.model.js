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


export { saveFile, getFile, getFileByName };