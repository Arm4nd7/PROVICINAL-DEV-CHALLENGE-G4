// controllers/valoracion.controllers.js
import { ValoracionModel } from "../models/valoracion.model.js";

export const createOne = async (req, res) => {
    const data = req.body;
    const result = await ValoracionModel.create(data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.status(201).json({ message: "SE INSERTO", data: result.data });
};

export const readAll = async (req, res) => {
    const valoraciones = await ValoracionModel.getAll();
    res.json(valoraciones);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const valoracion = await ValoracionModel.getById(id);

    if (!valoracion) {
        return res.status(404).json({ message: "valoracion no encontrada" });
    }
    res.json(valoracion);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await ValoracionModel.update(id, data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.json(result.data);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const deleted = await ValoracionModel.delete(id);

    if (!deleted) {
        return res.status(404).json({ message: "la valoracion no existe" });
    }
    return res.sendStatus(204);
};
