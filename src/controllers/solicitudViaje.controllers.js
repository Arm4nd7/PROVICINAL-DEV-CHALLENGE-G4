import { pool } from "../db.js";
//vamos a exportar las consultas

export const createOne = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO solicitudViaje(viaje_id, pasajero_id, estado) VALUES ($1, $2, $3) RETURNING *",
            [data.viaje_id, data.pasajero_id, data.estado],
        );
        return res.json({ message: "SE INSERTO" }, rows[0]);
    } catch (e) {
        console.log(e);
        if (e?.code === "23505") {
            return res.status(409).json({ message: "la solicitud de viaje ya existe exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const readAll = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM solicitudViaje");
    res.json(rows);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM solicitudViaje WHERE id = $1", [
        id,
    ]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "solicitud de viaje no encontrado" });
    }
    res.json(rows);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
        "UPDATE solicitudViaje SET viaje_id = $1, pasajero_id = $2, estado = $3 WHERE id = $4 RETURNING *",
        [data.viaje_id, data.pasajero_id, data.estado, id]
    );
    return res.json(rows[0]);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const { rowsCount } = await pool.query(
        "DELETE FROM solicitudViaje WHERE id = $1 RETURNING *",
        [id]
    );
    if (rowsCount.length === 0) {
        return res.status(404).json({ message: "la solictud de viaje no existe" });
    }
    return res.sendStatus(204);
};
