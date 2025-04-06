import sha256 from 'js-sha256';
import { createUser, getUserByEmail } from './user.model.js';

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = sha256(password);

    // Verificar que la solicitud contenga usuario y contraseña
    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe. Intenta con otro correo." });
    }

    try {
        const userId = await createUser({ email, passwordHash });
        res.status(201).json({ message: 'Usario registrado exitosamente.', userId });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error al crear el usuario:', error });
    }
}

export {
    registerUser,
}