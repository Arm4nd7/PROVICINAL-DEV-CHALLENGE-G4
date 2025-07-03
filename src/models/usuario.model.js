// models/usuario.model.js
import { pool } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js'

export class UsuarioModel {
  static async create({
    nombre,
    email,
    contrasena,
    tipo_usuario,
    telefono,
    facultad,
  }) {
    try {
      const saltRounds = 10;
      // const salt = await bcrypt.genSalt(10);
      console.log('Valor de contrasena antes de hash:', contrasena, 'Tipo:', typeof contrasena); // <-- AÑADE ESTA LÍNEA
      console.log('Valor de saltRounds antes de hash:', saltRounds, 'Tipo:', typeof saltRounds); // <-- Y ESTA LÍNEA
      const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
      const { rows } = await pool.query(
        "INSERT INTO usuario(nombre, email, contrasena, tipo_usuario, telefono, facultad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [nombre, email, hashedPassword, tipo_usuario, telefono, facultad]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      if (e?.code === "23505") {
        return { success: false, message: "Email already exists", status: 409 };
      }
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async login(email, contrasena) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM usuario WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return {
          success: false,
          message: "Email o contrasena incorrectos",
          status: 401
        };
      }

      const usuario = rows[0];
      const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!isMatch) {
        return {
          success: false,
          message: "Email o contrasena incorrectos",
          status: 401,
        };
      }
      const payload = {
        id: usuario.id,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      return {
        success: true,
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario,
          facultad: usuario.facultad
        },
        token: token
      };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM usuario");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM usuario WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async update(
    id,
    { nombre, email, contrasena, tipo_usuario, telefono, facultad }
  ) {
    try {
      let hashedPassword = contrasena;
      //hashearla contrasena nueva
      if (contrasena) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(contrasena, salt);
      }
      const { rows } = await pool.query(
        "UPDATE usuario SET nombre = $1, email = $2, contrasena = $3, tipo_usuario = $4, telefono = $5, facultad = $6 WHERE id = $7 RETURNING *",
        [nombre, email, hashedPassword, tipo_usuario, telefono, facultad, id]
      );
      return { success: true, data: rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Internal server error", status: 500 };
    }
  }

  static async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM usuario WHERE id = $1 RETURNING *",
      [id]
    );
    return rowCount > 0;
  }
}
