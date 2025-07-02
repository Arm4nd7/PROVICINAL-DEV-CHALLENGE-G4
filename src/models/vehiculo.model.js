// models/vehiculo.model.js
import { pool } from "../db.js";

export class VehiculoModel {
  static async create({ usuario_id, marca, modelo, placa }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO vehiculo(usuario_id, marca, modelo, placa) VALUES ($1, $2, $3, $4) RETURNING *",
        [usuario_id, marca, modelo, placa]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      if (e?.code === "23505") {
        return { success: false, message: "Placa already exists", status: 409 };
      }
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM vehiculo");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM vehiculo WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async update(id, { usuario_id, marca, modelo, placa }) {
    try {
      const { rows } = await pool.query(
        "UPDATE vehiculo SET usuario_id = $1, marca = $2, modelo = $3, placa = $4 WHERE id = $5 RETURNING *",
        [usuario_id, marca, modelo, placa, id]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM vehiculo WHERE id = $1 RETURNING *",
      [id]
    );
    return rowCount > 0;
  }
}
