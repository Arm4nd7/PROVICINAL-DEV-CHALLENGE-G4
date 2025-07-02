// models/viaje.model.js
import { pool } from "../db.js";

export class ViajeModel {
  static async create({
    conductor_id,
    punto_encuentro_id,
    hora_salida,
    cupos_disponibles,
  }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO viaje(conductor_id, punto_encuentro_id, hora_salida, cupos_disponibles) VALUES ($1, $2, $3, $4) RETURNING *",
        [conductor_id, punto_encuentro_id, hora_salida, cupos_disponibles]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      if (e?.code === "23505") {
        return {
          success: false,
          message: "ERROR (likely duplicate key)",
          status: 409,
        };
      }
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM viaje");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM viaje WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async update(
    id,
    { conductor_id, punto_encuentro_id, hora_salida, cupos_disponibles }
  ) {
    try {
      const { rows } = await pool.query(
        "UPDATE viaje SET conductor_id = $1, punto_encuentro_id = $2, hora_salida = $3, cupos_disponibles = $4 WHERE id = $5 RETURNING *",
        [conductor_id, punto_encuentro_id, hora_salida, cupos_disponibles, id]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM viaje WHERE id = $1 RETURNING *",
      [id]
    );
    return rowCount > 0;
  }
}
