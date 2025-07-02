// models/puntoEncuentro.model.js
import { pool } from "../db.js";

export class PuntoEncuentroModel {
  static async create({ nombre, direccion, coordenada }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO puntoEncuentro(nombre, direccion, coordenada) VALUES ($1, $2, $3) RETURNING *",
        [nombre, direccion, coordenada]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      if (e?.code === "23505") {
        return {
          success: false,
          message: "Error de clave duplicada (configurable)",
          status: 409,
        };
      }
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM puntoEncuentro");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM puntoEncuentro WHERE id = $1",
      [id]
    );
    return rows[0];
  }

  static async update(id, { nombre, direccion, coordenada }) {
    try {
      const { rows } = await pool.query(
        "UPDATE puntoEncuentro SET nombre = $1, coordenada = $2, direccion = $3 WHERE id = $4 RETURNING *",
        [nombre, coordenada, direccion, id]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM puntoEncuentro WHERE id = $1 RETURNING *",
      [id]
    );
    return rowCount > 0;
  }
}
