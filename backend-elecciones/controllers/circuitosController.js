const { getConnection } = require('../db/connection');

async function obtenerCircuitos(req, res) {
  try {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM CIRCUITO');
    conn.closeSync();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener circuitos', detail: error.message });
  }
}

module.exports = { obtenerCircuitos };