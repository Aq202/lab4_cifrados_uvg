import { signECC, verifyECC } from "../../services/cypher/ECC.js";
import { signRSA, verifyRSA } from "../../services/cypher/RSA.js";
import consts from "../../utils/consts.js";
import { getUserPublicKey } from "../key/key.model.js";
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { getFile, saveFile } from "./file.model.js";
import CustomError from "../../utils/customError.js";

const saveFileController = async (req, res) => {
    
    try{
        const { privateKey, fileName: fileOriginalName } = req.body;
        const userId = req.user.id;
        
        let error = null;
        if(!(req.uploadedFiles?.length > 0)) {
            error = 'No se subió ningún archivo.';
        }else if (!privateKey){
            error = "El campo 'privateKey' es obligatorio.";
        }else if (!fileOriginalName) {
            error = "El campo 'fileName' es obligatorio.";
        }
        
        // Obtener tipo de algoritmo de la clave pública (debería ser el mismo que el de la clave privada)
        const algorithm = (await getUserPublicKey(userId))?.algorithm;
        if (!algorithm) {
            res.status(400).send({ err: 'No se encontró la clave pública del usuario.', status: 400 });
            return;
        }

        if (error) {
            res.status(400).send({ err: error, status: 400 });
            return;
        }

        // Remover saltos de línea del privateKey
        const privateKeyCleaned = privateKey.replace(/\\n/g, '\n');

        // Obtener contenido del archivo subido
        const {fileName} = req.uploadedFiles[0];
        const filePath = path.join(global.dirname, 'files', fileName);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Obtener tipo de archivo
        const fileMimeType = mime.lookup(fileOriginalName);
        
        // Generar hash del contenido del archivo
        let hash = null;
        if (algorithm === consts.cypherAlgorithms.RSA) {
            hash = signRSA(privateKeyCleaned, fileContent);
        } else if (algorithm === consts.cypherAlgorithms.ECC) {
            hash = signECC(privateKeyCleaned, fileContent);
        } else {
            res.status(400).send({ err: 'Algoritmo de cifrado no soportado.', status: 400 });
            return;
        }

        await saveFile({
            fileName: fileOriginalName,
            mimeType: fileMimeType,
            fileContent,
            userId,
            hash
        })

        res.status(200).send({ message: 'Archivo guardado correctamente.', status: 200 });
    }catch(ex){
        let err = 500;
        let status = "Ocurrio un error inesperado.";
        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status ?? 500;
        }
        res.statusMessage = err;
        res.status(status).send({ err, status });
    }

};

const getFileController = async (req, res) => {
    const { fileId } = req.params;

    // Obtener el archivo de la base de datos
    const file = await getFile(fileId);
    if (!file) {
        res.status(404).send({ err: 'Archivo no encontrado.', status: 404 });
        return;
    }

    // Devolver archivo
    const { fileName, mimeType, content } = file;
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(content);
}

export {
    saveFileController,
    getFileController,
};