import { generateKeyPairAsync } from "../../utils/keyGenerator.js";
import { savePublicKey } from "./key.model.js";

const generateKeyPair = async (req, res) => {
    const userId = req.user && req.user.id; // Obtener el userId del token JWT
    const { algorithm } = req.body;

    // Verificar que la solicitud contenga userId y algoritmo
    if (!userId || !algorithm) {
        res.statusMessage = "El usuario autenticado y el algoritmo de encriptado son requeridos";
        return res.status(400).json({ message: "El usuario autenticado y el algoritmo de encriptado son requeridos" });
    }

    try {
        // Generar el par de claves
        const { publicKey, privateKey } = await generateKeyPairAsync(algorithm);

        // Guardar la clave pública en la base de datos
        const publicKeyId = await savePublicKey({ userId, publicKey, algorithm });

        res.status(200).json({ message: 'Par de claves generado exitosamente.', publicKeyId, publicKey, privateKey });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Ocurrió un error al generar el par de claves:', error });
    }

}

export {
    generateKeyPair,
}