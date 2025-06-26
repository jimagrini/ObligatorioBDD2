const { getConnection } = require('../db/connection');

async function obtenerResultados(req, res) {
try {
const conn = await getConnection();
const resultados = await conn.query(`
  SELECT 
    V.id_eleccion,
    V.numero_lista,
    L.nombre_partido,
    COUNT(*) AS total_votos
  FROM VOTO V
  JOIN LISTA L ON V.numero_lista = L.numero
  GROUP BY V.id_eleccion, V.numero_lista, L.nombre_partido
  ORDER BY V.id_eleccion, total_votos DESC
`);

conn.closeSync();
res.json(resultados);
} catch (error) {
res.status(500).json({ error: 'Error al obtener resultados', detalle: error.message });
}
}

module.exports = { obtenerResultados };