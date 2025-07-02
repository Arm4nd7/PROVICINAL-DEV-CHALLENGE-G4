import { pool } from "../db.js";
//vamos a exportar las consultas

export const createOne = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO usuario(nombre, email, contrasena, tipo_usuario, telefono, facultad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [data.nombre, data.email, data.contrasena, data.tipo_usuario, data.telefono, data.facultad]
        );
        return res.json({ message: "SE INSERTO" }, rows[0]);
    } catch (e) {
        console.log(e);
        if (e?.code === "23505") {
            return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const readAll = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM usuario");
    res.json(rows);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM usuario WHERE id = $1", [
        id,
    ]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "usuario no encontrado" });
    }
    res.json(rows);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
        "UPDATE usuario SET nombre = $1, email = $2, contrasena = $3, tipo_usuario = $4, telefono = $5, facultad = $6 WHEREA id = $7 RETURNING *",
        [data.nombre, data.email, data.contrasena, data.tipo_usuario, data.telefono, data.facultad, id]
    );
    return res.json(rows[0]);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const { rowsCount } = await pool.query(
        "DELETE FROM usuario WHERE id = $1 RETURNING *",
        [id]
    );
    if (rowsCount.length === 0) {
        return res.status(404).json({ message: "el usuario no existe" });
    }
    return res.sendStatus(204);
};
