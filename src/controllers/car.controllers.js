import { pool } from "../db.js";
//vamos a exportar las consultas

export const createOne = async (req, res) => {
    try
    {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO conductor(valores) VALUES ($1, $2) RETURNING *",
            [data.values1, data.value2]
        );
        return res.json({ message: "SE INSERTO" }, rows[0]);
    }catch(e){
        console.log(e);
        if(e?.code === "23505"){
            return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const readAll = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM conductor");
    res.json(rows);
};

export const readOne = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM conductor WHERE id = $1", [
        id,
    ]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "conductor no encontrado" });
    }
    res.json(rows);
};

export const updateOne = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { rows } = await pool.query(
        "UPDATE conductor SET value1 = $1, value2 = $2 WHEREA id = $3 RETURNING *",
        [data.values1, data.value2, id]
    );
    return res.json(rows[0]);
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const { rowsCount } = await pool.query(
        "DELETE FROM conductor WHERE id = $1 RETURNING *",
        [id]
    );
    if (rowsCount.length === 0) {
        return res.status(404).json({ message: "el conductor no existe" });
    }
    return res.sendStatus(204);
};
