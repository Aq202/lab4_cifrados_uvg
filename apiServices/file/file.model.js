import { executeQuery } from "../../db/connection.js";
import CustomError from "../../utils/customError.js";

const saveFile = async ({ fileName, mimeType, fileContent, userId, hash}) => {
    try{
    const query = `
      INSERT INTO files (file_name, mime_type, content, user_id, hash) 
      VALUES (?, ?, ?, ?, ?)
    `;
    return await executeQuery(query, [fileName, mimeType, fileContent, userId, hash]);
    }catch (error) {
        // Verificar si el error es por duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            throw new CustomError('El archivo ya existe, intenta cambiar el nombre del archivo.', 400);
        } else {
            throw error; // Lanzar el error original si no es un duplicado
        }
    }
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


export { saveFile, getFile };