const { getConnection } = require('../db/connection');

async function obtenerListas(req, res) {
try {
const conn = await getConnection();
const result = await conn.query('SELECT NUMERO, NOMBRE_PARTIDO FROM LISTA');
conn.closeSync();
res.json(result);
} catch (error) {
res.status(500).json({ error: 'Error al obtener listas', detail: error.message });
}
}

module.exports = { obtenerListas };
