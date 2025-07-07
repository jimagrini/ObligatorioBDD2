const { getConnection } = require('../db/connection');

async function registrarCiudadano(req, res) {
  const { ci, nombre, fecha_nac } = req.body;

  if (!ci || !nombre || !fecha_nac) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const conn = await getConnection();

    const query = `
      INSERT INTO CIUDADANO (ci, nombre, fecha_nac)
      VALUES (?, ?, ?)
    `;

    await conn.query(query, [ci, nombre, fecha_nac]);

    conn.closeSync();
    res.status(201).json({ mensaje: 'Ciudadano registrado correctamente' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al registrar ciudadano',
      detalle: error.message,
    });
  }
}

async function obtenerCiudadanos(req, res) {
  try {
    const conn = await getConnection();
    const ciudadanos = await conn.query('SELECT * FROM CIUDADANO');
    conn.closeSync();
    res.json(ciudadanos);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al obtener ciudadanos', detalle: error.message });
  }
}

module.exports = {
  registrarCiudadano,
  obtenerCiudadanos,
};
