// controllers/vehiculo.controllers.js
import { VehiculoModel } from "../models/vehiculo.model.js";

export const createOne = async (req, res) => {
    const data = req.body;
    const result = await VehiculoModel.create(data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.status(201).json({ message: "SE INSERTO", data: result.data });
};

export const readAll = async (req, res) => {
    const vehiculos = await VehiculoModel.getAll();
    res.json(vehiculos);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const vehiculo = await VehiculoModel.getById(id);

    if (!vehiculo) {
        return res.status(404).json({ message: "vehiculo no encontrado" });
    }
    res.json(vehiculo);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await VehiculoModel.update(id, data);

    if (!result.success) {
        return res.status(result.status).json({ message: result.message });
    }
    return res.json(result.data);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const deleted = await VehiculoModel.delete(id);

    if (!deleted) {
        return res.status(404).json({ message: "el vehiculo no existe" });
    }
    return res.sendStatus(204);
};