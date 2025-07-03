// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado" });
        }
        req.user = user; // Almacena la información del usuario decodificada en req.user
        next();
    });
};

// Middleware para verificar el tipo de usuario (opcional, pero útil)
export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.tipo_usuario)) {
            return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
        }
        next();
    };
};