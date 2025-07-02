// models/valoracion.model.js
import { pool } from "../db.js";

export class ValoracionModel {
  static async create({
    de_usuario_id,
    para_usuario_id,
    viaje_id,
    calificacion,
    comentario,
  }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO valoracion(de_usuario_id, para_usuario_id, viaje_id, calificacion, comentario) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [de_usuario_id, para_usuario_id, viaje_id, calificacion, comentario]
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
    const { rows } = await pool.query("SELECT * FROM valoracion");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM valoracion WHERE id = $1",
      [id]
    );
    return rows[0];
  }

  static async update(
    id,
    { de_usuario_id, para_usuario_id, viaje_id, calificacion, comentario }
  ) {
    try {
      const { rows } = await pool.query(
        "UPDATE valoracion SET de_usuario_id = $1, para_usuario_id = $2, viaje_id = $3, calificacion = $4, comentario = $5 WHERE id = $6 RETURNING *",
        [de_usuario_id, para_usuario_id, viaje_id, calificacion, comentario, id]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM valoracion WHERE id = $1 RETURNING *",
      [id]
    );
    return rowCount > 0;
  }
}
