const { getConnection } = require('../db/connection');

async function obtenerElecciones(req, res) {
try {
const conn = await getConnection();
const result = await conn.query('SELECT ID_ELECCION, FECHA_REALIZACION, TIPO_ELECCION FROM ELECCION');
conn.closeSync();
res.json(result);
} catch (error) {
res.status(500).json({ error: 'Error al obtener elecciones', detail: error.message });
}
}

module.exports = { obtenerElecciones };

