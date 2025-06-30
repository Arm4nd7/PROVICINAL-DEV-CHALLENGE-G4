import { pool } from "../db.js";
//vamos a exportar las consultas

export const createOne = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO valoracion(de_usuario_id, para_usuario_id, viaje_id, calificacion, comentario) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [data.de_usuario_id, data.para_usuario_id, data.viaje_id, data.calificacion, data.comentario]
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
    const { rows } = await pool.query("SELECT * FROM valoracion");
    res.json(rows);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM valoracion WHERE id = $1", [
        id,
    ]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "valoracion no encontrada" });
    }
    res.json(rows);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
        "UPDATE valoracion SET de_usuario_id = $1, para_usuario_id = $2, viaje_id = $3, calificacion = $4, comentario = $5 WHEREA id = $6 RETURNING *",
        [data.de_usuario_id, data.para_usuario_id, data.viaje_id, data.calificacion, data.comentario, id]
    );
    return res.json(rows[0]);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const { rowsCount } = await pool.query(
        "DELETE FROM valoracion WHERE id = $1 RETURNING *",
        [id]
    );
    if (rowsCount.length === 0) {
        return res.status(404).json({ message: "la valoracion no existe" });
    }
    return res.sendStatus(204);
};
