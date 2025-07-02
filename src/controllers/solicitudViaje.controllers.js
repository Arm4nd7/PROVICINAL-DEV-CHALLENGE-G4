// controllers/solicitudViaje.controllers.js
import { SolicitudViajeModel } from "../models/solicitudViaje.model.js";

export const createOne = async (req, res) => {
    const data = req.body;
    const result = await SolicitudViajeModel.create(data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.status(201).json({ message: "SE INSERTO", data: result.data });
};

export const readAll = async (req, res) => {
    const solicitudes = await SolicitudViajeModel.getAll();
    res.json(solicitudes);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const solicitud = await SolicitudViajeModel.getById(id);

    if (!solicitud) {
        return res
            .status(404)
            .json({ message: "solicitud de viaje no encontrado" });
    }
    res.json(solicitud);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await SolicitudViajeModel.update(id, data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.json(result.data);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const deleted = await SolicitudViajeModel.delete(id);

    if (!deleted) {
        return res.status(404).json({ message: "la solicitud de viaje no existe" });
    }
    return res.sendStatus(204);
};
