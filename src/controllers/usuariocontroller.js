const { crearUsuario, obtenerUsuarios } = require('../models/usuarioModel');

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const postUsuario = async (req, res) => {
  try {
    console.log("Llegó al controlador POST /api/usuarios");
    const nuevo = await crearUsuario(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear usuario:', error);  
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};


module.exports = { getUsuarios, postUsuario };