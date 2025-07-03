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
    try {
      const { rows } = await pool.query(
        `
            SELECT
                v.id,
                v.conductor_id,
                u.nombre AS conductor_nombre,
                u.telefono AS conductor_telefono,
                v.punto_encuentro_id,
                pe.nombre AS punto_encuentro_nombre,
                pe.direccion AS punto_encuentro_direccion,
                v.hora_salida,
                v.cupos_disponibles
            FROM
                viaje v
            JOIN
                usuario u ON v.conductor_id = u.id
            JOIN
                puntoEncuentro pe ON v.punto_encuentro_id = pe.id
            ORDER BY
                v.hora_salida ASC
            `
      );
      return rows;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getById(id) {
    try {
      const { rows } = await pool.query(
        `
      SELECT
          v.id,
          v.conductor_id,
          u.nombre AS conductor_nombre,
          u.telefono AS conductor_telefono,
          v.punto_encuentro_id,
          pe.nombre AS punto_encuentro_nombre,
          pe.direccion AS punto_encuentro_direccion,
          v.hora_salida,
          v.cupos_disponibles
      FROM
          viaje v
      JOIN
          usuario u ON v.conductor_id = u.id
      JOIN
          puntoEncuentro pe ON v.punto_encuentro_id = pe.id
      WHERE v.id = $1
      `,
        [id]
      );
      return rows[0];
    } catch (e) {
      console.error(e);
      return null;
    }
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
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM viaje WHERE id = $1 RETURNING *",
        [id]
      );
      return rowCount > 0;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
