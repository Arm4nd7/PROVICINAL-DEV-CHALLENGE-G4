import { pool } from "../db.js";
//vamos a exportar las consultas

export const createOne = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO viaje(conductor_id, punto_encuentro_id, hora_salida, cupos_disponibles) VALUES ($1, $2, $3, $4) RETURNING *",
            [data.conductor_id, data.punto_encuentro_id, data.hora_salida, data.cupos_disponibles]
        );
        return res.json({ message: "SE INSERTO" }, rows[0]);
    } catch (e) {
        console.log(e);
        if (e?.code === "23505") {
            return res.status(409).json({ message: "ERROR" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const readAll = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM viaje");
    res.json(rows);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM viaje WHERE id = $1", [
        id,
    ]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "viaje no encontrado" });
    }
    res.json(rows);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
        "UPDATE viaje SET conductor_id = $1, punto_encuentro_id = $2, hora_salida = $3, cupos_disponibles = $4 WHEREA id = $5 RETURNING *",
        [data.conductor_id, data.punto_encuentro_id, data.hora_salida, data.cupos_disponibles, id]
    );
    return res.json(rows[0]);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const { rowsCount } = await pool.query(
        "DELETE FROM viaje WHERE id = $1 RETURNING *",
        [id]
    );
    if (rowsCount.length === 0) {
        return res.status(404).json({ message: "el viaje no existe" });
    }
    return res.sendStatus(204);
};
