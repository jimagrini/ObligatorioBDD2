const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/connection');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.query(`
      SELECT NUMERO, NOMBRE_PARTIDO
      FROM LISTA
    `);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listas', detalle: error.message });
  }
});

module.exports = router;
