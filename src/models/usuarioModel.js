const pool = require('../db');

const crearUsuario = async ({ nombre, email, contraseña, tipo_usuario, telefono, facultad }) => {
  console.log("Datos recibidos:", { nombre, email, contraseña, tipo_usuario, telefono, facultad }); // 👈 Aquí

  const result = await pool.query(
    'INSERT INTO usuarios (nombre, email, contraseña, tipo_usuario, telefono, facultad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nombre, email, contraseña, tipo_usuario, telefono, facultad]
  );
  return result.rows[0];
};

const obtenerUsuarios = async () => {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows;
};

module.exports = { crearUsuario, obtenerUsuarios };