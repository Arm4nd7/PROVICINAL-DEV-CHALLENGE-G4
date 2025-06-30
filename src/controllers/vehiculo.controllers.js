import { pool } from "../db.js";
//vamos a exportar las consultas

export const createOne = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO vehiculo(usuario_id, marca, modelo, placa) VALUES ($1, $2, $3, $4) RETURNING *",
            [data.usuario_id, data.marca, data.modelo, data.placa]
        );
        return res.json({ message: "SE INSERTO" }, rows[0]);
    } catch (e) {
        console.log(e);
        if (e?.code === "23505") {
            return res.status(409).json({ message: "placa already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const readAll = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM vehiculo");
    res.json(rows);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM vehiculo WHERE id = $1", [
        id,
    ]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "vehiculo no encontrado" });
    }
    res.json(rows);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
        "UPDATE vehiculo SET usuario_id = $1, marca = $2, modelo = $3, placa = $4 WHEREA id = $5 RETURNING *",
        [data.usuario_id, data.marca, data.modelo, data.placa, id]
    );
    return res.json(rows[0]);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const { rowsCount } = await pool.query(
        "DELETE FROM vehiculo WHERE id = $1 RETURNING *",
        [id]
    );
    if (rowsCount.length === 0) {
        return res.status(404).json({ message: "el vehiculo no existe" });
    }
    return res.sendStatus(204);
};
