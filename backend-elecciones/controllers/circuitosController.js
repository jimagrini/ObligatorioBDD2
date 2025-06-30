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

async function obtenerResumenVotosPorCircuito(req, res) {
const { idEleccion } = req.params;
const { getConnection } = require('../db/connection');

try {
const conn = await getConnection();

const query = `
  SELECT 
    V.num_circuito AS NUM_CIRCUITO,
    SUM(CASE WHEN V.condicion = 'válido' THEN 1 ELSE 0 END) AS VALIDOS,
    SUM(CASE WHEN V.condicion = 'anulado' THEN 1 ELSE 0 END) AS ANULADOS,
    SUM(CASE WHEN V.esObservado = 1 THEN 1 ELSE 0 END) AS OBSERVADOS,
    COUNT(*) AS TOTAL
  FROM VOTO V
  WHERE V.id_eleccion = ?
  GROUP BY V.num_circuito
  ORDER BY V.num_circuito
`;

const resultados = await conn.query(query, [idEleccion]);

conn.closeSync();
res.json(resultados);
} catch (error) {
res.status(500).json({ error: 'Error al obtener resumen de votos', detalle: error.message });
}
};

module.exports = { obtenerCircuitos, obtenerResumenVotosPorCircuito };