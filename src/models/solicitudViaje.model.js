// models/solicitudViaje.model.js
import { pool } from "../db.js";

export class SolicitudViajeModel {
  static async create({ viaje_id, pasajero_id, estado }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO solicitudViaje(viaje_id, pasajero_id, estado) VALUES ($1, $2, $3) RETURNING *",
        [viaje_id, pasajero_id, estado]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      if (e?.code === "23505") {
        return {
          success: false,
          message: "La solicitud de viaje ya existe",
          status: 409,
        };
      }
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM solicitudViaje");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM solicitudViaje WHERE id = $1",
      [id]
    );
    return rows[0];
  }

  static async update(id, { viaje_id, pasajero_id, estado }) {
    try {
      const { rows } = await pool.query(
        "UPDATE solicitudViaje SET viaje_id = $1, pasajero_id = $2, estado = $3 WHERE id = $4 RETURNING *",
        [viaje_id, pasajero_id, estado, id]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM solicitudViaje WHERE id = $1 RETURNING *",
      [id]
    );
    return rowCount > 0;
  }
}
