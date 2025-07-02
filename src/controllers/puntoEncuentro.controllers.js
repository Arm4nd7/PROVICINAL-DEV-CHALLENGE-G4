// controllers/puntoEncuentro.controllers.js
import { PuntoEncuentroModel } from "../models/puntoEncuentro.model.js";

export const createOne = async (req, res) => {
    const data = req.body;
    const result = await PuntoEncuentroModel.create(data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res
        .status(201)
        .json({ message: "SE INSERTO un punto de encuentro", data: result.data });
};

export const readAll = async (req, res) => {
    const puntos = await PuntoEncuentroModel.getAll();
    res.json(puntos);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const punto = await PuntoEncuentroModel.getById(id);

    if (!punto) {
        return res
            .status(404)
            .json({ message: "PUNTO DE ENCUENTRO no encontrado" });
    }
    res.json(punto);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await PuntoEncuentroModel.update(id, data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.json(result.data);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const deleted = await PuntoEncuentroModel.delete(id);

    if (!deleted) {
        return res.status(404).json({ message: "el punto de encuentro no existe" });
    }
    return res.sendStatus(204);
};
