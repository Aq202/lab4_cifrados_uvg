import sha256 from 'js-sha256';
import { createUser, getUserByEmail } from './user.model.js';
import { generateKeyPairAsync } from '../../utils/keyGenerator.js';
import { savePublicKey } from '../key/key.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    const { email, password, algorithm } = req.body;

    // Verificar que la solicitud contenga usuario y contraseña
    if (!email || !password || !algorithm) {
        res.statusMessage = "Email, contraseña y algormitmo para generar el par de llaves son requeridos";
        return res.status(400).json({ message: "Email, contraseña y algormitmo para generar el par de llaves son requeridos" });
    }

    const passwordHash = sha256(password);

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        res.statusMessage = "El usuario ya existe. Intenta con otro correo.";
        return res.status(400).json({ message: "El usuario ya existe. Intenta con otro correo." });
    }

    try {
        const userId = await createUser({ email, passwordHash });
        
        // Generar el par de claves
        const { publicKey, privateKey } = await generateKeyPairAsync(algorithm);

        // Guardar la clave pública en la base de datos
        const publicKeyId = await savePublicKey({ userId, publicKey, algorithm });

        // Generar token JWT, con una expiración de 1 hora
        const token = jwt.sign(
            { id: userId, email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'Usario registrado exitosamente.', userId, publicKeyId, publicKey, privateKey, token });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error al crear el usuario:', error });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Verificar que la solicitud contenga usuario y contraseña
    if (!email || !password) {
        res.statusMessage = "Email y contraseña son requeridos";
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    try {
        // Buscar el usuario por email
        const user = await getUserByEmail(email);
        if (!user) {
            res.statusMessage = "No se encontró un usuario con el correo indicado";
            return res.status(401).json({ message: "No se encontró un usuario con el correo indicado" });
        }
    
        // Comparar la contraseña hasheada
        const passwordHash = sha256(password);
        if (user.password !== passwordHash) {
            res.statusMessage = "Credenciales inválidas";
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
    
        // Generar el token JWT, con una expiración de 1 hora
        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
    
        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
}

export {
    registerUser,
    loginUser,
}