import sha256 from 'js-sha256';
import { createUser, getUserByEmail } from './user.model.js';
import { generateKeyPairAsync } from '../../utils/keyGenerator.js';
import { savePublicKey } from '../key/key.model.js';

const registerUser = async (req, res) => {
    const { email, password, algorithm } = req.body;

    // Verificar que la solicitud contenga usuario y contraseña
    if (!email || !password || !algorithm) {
        return res.status(400).json({ message: "Email, contraseña y algormitmo para generar el par de llaves son requeridos" });
    }

    const passwordHash = sha256(password);

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe. Intenta con otro correo." });
    }

    try {
        const userId = await createUser({ email, passwordHash });
        
        // Generar el par de claves
        const { publicKey, privateKey } = await generateKeyPairAsync(algorithm);

        // Guardar la clave pública en la base de datos
        const publicKeyId = await savePublicKey({ userId, publicKey, algorithm });

        res.status(201).json({ message: 'Usario registrado exitosamente.', userId, publicKeyId, publicKey, privateKey });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error al crear el usuario:', error });
    }
}

export {
    registerUser,
}