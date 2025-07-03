// controllers/usuario.controllers.js
import { UsuarioModel } from "../models/usuario.model.js";

export const createOne = async (req, res) => {
    const data = req.body;
    const result = await UsuarioModel.create(data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.status(201).json({ message: "SE INSERTO", data: result.data });
};

export const login = async (req, res) => {
    const { email, contrasena } = req.body;
    
    if (!email || !contrasena) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const result = await UsuarioModel.login(email, contrasena);
    
    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    
    return res.json({ 
        message: "Login exitoso", 
        data: result.data,
        token: result.token 
    });
};

export const readAll = async (req, res) => {
    const usuarios = await UsuarioModel.getAll();
    res.json(usuarios);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);

    if (!usuario) {
        return res.status(404).json({ message: "usuario no encontrado" });
    }
    res.json(usuario);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await UsuarioModel.update(id, data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.json(result.data);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const deleted = await UsuarioModel.delete(id);

    if (!deleted) {
        return res.status(404).json({ message: "el usuario no existe" });
    }
    return res.sendStatus(204);
};
