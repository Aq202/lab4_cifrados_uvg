import { signECC, verifyECC } from "../../services/cypher/ECC.js";
import { encryptWithPrivateKeyRSA, decryptWithPublicKeyRSA } from "../../services/cypher/RSA.js";
import sha256 from 'js-sha256';
import consts from "../../utils/consts.js";
import { getUserPublicKey } from "../key/key.model.js";
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { getFile, getFileByName, saveFile, getFiles } from "./file.model.js";
import CustomError from "../../utils/customError.js";

const saveFileController = async (req, res) => {
    
    try{
        const { privateKey, fileName: fileOriginalName } = req.body;
        const includeHash = req.body.includeHash ?? true;
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
        const publicKeyData = await getUserPublicKey(userId);
        if (!publicKeyData) {
            res.status(400).send({ err: 'No se encontró la clave pública del usuario.', status: 400 });
            return;
        }

        const { algorithm } = publicKeyData;

        if (error) {
            res.status(400).send({ err: error, status: 400 });
            return;
        }

        // Remover saltos de línea del privateKey
        const privateKeyCleaned = privateKey.replace(/\\n/g, '\n');

        // Obtener contenido del archivo subido
        const {fileName} = req.uploadedFiles[0];
        const filePath = path.join(global.dirname, 'files', fileName);
        const fileContent = fs.readFileSync(filePath);
        const fileContentBase64 = Buffer.from(fileContent).toString('base64');

        // Obtener tipo de archivo
        const fileMimeType = mime.lookup(fileOriginalName);
        
        // Generar hash del contenido del archivo y cifrarlo (firma digital)
        let hashEncrypted = null;

        if (includeHash === 'true' || includeHash === true) {
            
            try{
                if (algorithm === consts.cypherAlgorithms.RSA) {
                    // Firma digital usando RSA
                    const fileContentHash = sha256(fileContent);
                    hashEncrypted = encryptWithPrivateKeyRSA(privateKeyCleaned, fileContentHash);

                } else if (algorithm === consts.cypherAlgorithms.ECC) {
                    // Firma digital usando ECC
                    hashEncrypted = signECC(privateKeyCleaned, fileContent);
                } else {
                    res.status(400).send({ err: 'Algoritmo de cifrado no soportado.', status: 400 });
                    return;
                }
            
            }catch(ex){
                // La llave privada no es válida
                console.log(ex);
                res.status(400).send({ err: 'La llave privada no es válida para firmar el archivo.', status: 400 });
                return; 
            }
        }

        // Cifrar el contenido del archivo

        let fileContentEncrypted = null;

        try{
            if (algorithm === consts.cypherAlgorithms.RSA) {
                // Cifrar contenido usando RSA
                fileContentEncrypted = encryptWithPrivateKeyRSA(privateKeyCleaned, fileContentBase64);
            } else if (algorithm === consts.cypherAlgorithms.ECC) {
                fileContentEncrypted = fileContentBase64; // No se cifra el contenido usando ECC
            } else {
                res.status(400).send({ err: 'Algoritmo de cifrado no soportado.', status: 400 });
                return;
            }
        }catch(ex){
            // La llave privada no es válida
            console.log(ex)
            res.status(400).send({ err: 'La llave privada no es válida para cifrar el archivo.', status: 400 });
            return; 
        }

        await saveFile({
            fileName: fileOriginalName,
            mimeType: fileMimeType,
            fileContent: fileContentEncrypted,
            userId,
            hash: hashEncrypted
        })

        res.status(200).send({ message: 'Archivo guardado correctamente.', status: 200 });
    }catch(ex){
        let err = "Ocurrio un error inesperado.";
        let status = 500;
        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status ?? 500;
        }else{
            console.log(ex);
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
    const { fileName, mimeType, content: encryptedContent } = file;

    // Obtener llave pública del usuario dueño del archivo
    const publicKeyData = await getUserPublicKey(file.userId);
    if (!publicKeyData) {
        res.status(400).send({ err: 'No se encontró la clave pública del usuario.', status: 400 });
        return;
    }
    const { algorithm, public_key } = publicKeyData;

    // Descifrar el contenido
    let content = null;

    try{
        if (algorithm === consts.cypherAlgorithms.RSA) {
            content = decryptWithPublicKeyRSA(public_key, encryptedContent);
        }else if (algorithm === consts.cypherAlgorithms.ECC) {
            content = encryptedContent; // No se cifra el contenido usando ECC
        }else{
            res.status(400).send({ err: 'Algoritmo de descifrado no soportado.', status: 400 });
            return;
        }
    }catch(ex){
        // La llave pública no es válida
        res.status(400).send({ err: 'La llave pública no es válida para descifrar el archivo.', status: 400 });
        return; 
    }

    content = Buffer.from(content, 'base64'); // Convertir de base64 a utf-8

    // Devolver archivo
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(content);
}

const getFilesController = async (req, res) => {
    const files = await getFiles();
    if (!files) {
        res.status(404).send({ err: 'No se encontraron archivos.', status: 404 });
        return;
    }
    res.status(200).send({ files, status: 200 });
}

const verifyFileController = async (req, res) => {
    try{
        const { fileName: fileOriginalName, userId } = req.body;
        
        let error = null;
        if(!(req.uploadedFiles?.length > 0)) {
            error = 'No se subió ningún archivo.';
        }else if (!fileOriginalName) {
            error = "El campo 'fileName' es obligatorio.";
        }else if (!userId) {
            error = "El campo 'userId' es obligatorio.";
        }

        if (error) {
            res.status(400).send({ err: error, status: 400 });
            return;
        }

        // Obtener Id de usuario dueño del archivo
        const file = await getFileByName(fileOriginalName, userId);
        if (!file) {
            res.status(404).send({ err: 'Archivo no encontrado.', status: 404 });
            return;
        }

        const { userId: fileUserId, hash: originalHash } = file;

        if (!originalHash) {
            res.status(400).send({ err: 'El archivo no tiene firma digital.', status: 400 });
            return;
        }
        
        // Obtener llave pública del usuario dueño del archivo
        const publicKeyData = await getUserPublicKey(fileUserId);
        if (!publicKeyData) {
            res.status(400).send({ err: 'No se encontró la clave pública del usuario.', status: 400 });
            return;
        }

        const { algorithm, public_key } = publicKeyData;


        // Remover saltos de línea del publicKey
        const publicKeyCleaned = public_key.replace(/\\n/g, '\n');
       

         // Obtener contenido del archivo subido
         const {fileName} = req.uploadedFiles[0];
         const filePath = path.join(global.dirname, 'files', fileName);
         const fileContent = fs.readFileSync(filePath);
         
         
         let match = null;
         
        if (algorithm === consts.cypherAlgorithms.RSA) {
            // Generar hash del contenido del archivo subido
            const file_content_hash = sha256(fileContent);
            
            let originalHashDecrypted = null;
            try{
                originalHashDecrypted = decryptWithPublicKeyRSA(publicKeyCleaned, originalHash);
            }catch(ex){
                // La llave pública no es válida
                console.log(ex)
                res.status(400).send({ err: 'La llave pública no es válida para descifrar la firma digital.', status: 400 });
                return; 
            }

            // Comparar el hash original con el hash del archivo subido
            match = originalHashDecrypted === file_content_hash;
        

        } else if (algorithm === consts.cypherAlgorithms.ECC) {
            // Verificar firma digital usando ECC
            match = verifyECC(publicKeyCleaned, fileContent, originalHash); 

        } else {
            res.status(400).send({ err: 'Algoritmo de descifrado no soportado.', status: 400 });
            return;
        }

        const message = match ? 'El archivo coincide con el original.' : 'El archivo fue modificado.';
        res.status(200).send({ message, match, status: 200 });
        return;     

    }catch(ex){
        let err = "Ocurrio un error inesperado.";
        let status = 500;
        if (ex instanceof CustomError) {
            err = ex.message;
            status = ex.status ?? 500;
        }
        res.statusMessage = err;
        res.status(status).send({ err, status });
        console.log(ex);
    }
}



export {
    saveFileController,
    getFileController,
    verifyFileController,
    getFilesController
};