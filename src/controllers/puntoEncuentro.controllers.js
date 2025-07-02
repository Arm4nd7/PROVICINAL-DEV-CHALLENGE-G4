import { pool } from "../db.js";
//vamos a exportar las consultas

export const createOne = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO puntoEncuentro(nombre, direccion, coordenada) VALUES ($1, $2, $3) RETURNING *",
            [data.nombre, data.direccion, data.coordenada],
        );
        return res.json({ message: "SE INSERTO un punto de encuentro" }, rows[0]);
    } catch (e) {
        console.log(e);
        if (e?.code === "23505") {
            //iria el error de acuerdo a la base de datos
            return res.status(409).json({ message: "ERROR CONFIGURABLE" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const readAll = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM puntoEncuentro");
    res.json(rows);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM puntoEncuentro WHERE id = $1", [
        id,
    ]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "PUNTO DE ENCUENTRO no encontrado" });
    }
    res.json(rows);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
        "UPDATE puntoEncuentro SET nombre = $1, coordenada = $2, direccion = $3 WHERE id = $4 RETURNING *",
        [data.nombre, data.coordenada, data.direccion, id]
    );
    return res.json(rows[0]);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const { rowsCount } = await pool.query(
        "DELETE FROM puntoEncuentro WHERE id = $1 RETURNING *",
        [id]
    );
    if (rowsCount.length === 0) {
        return res.status(404).json({ message: "el punto de encuentro no existe" });
    }
    return res.sendStatus(204);
};
