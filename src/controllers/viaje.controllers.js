// controllers/viaje.controllers.js
import { ViajeModel } from "../models/viaje.model.js";

export const createOne = async (req, res) => {
    const data = req.body;
    const result = await ViajeModel.create(data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.status(201).json({ message: "SE INSERTO", data: result.data });
};

export const readAll = async (req, res) => {
    const viajes = await ViajeModel.getAll();
    res.json(viajes);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const viaje = await ViajeModel.getById(id);

    if (!viaje) {
        return res.status(404).json({ message: "viaje no encontrado" });
    }
    res.json(viaje);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await ViajeModel.update(id, data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.json(result.data);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const deleted = await ViajeModel.delete(id);

    if (!deleted) {
        return res.status(404).json({ message: "el viaje no existe" });
    }
    return res.sendStatus(204);
};