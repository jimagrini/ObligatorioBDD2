const { getConnection } = require('../db/connection');

async function obtenerResumen(req, res) {
  try {
  const funcionarioCI = req.user.ci;
  const conn = await getConnection();
  
  // Obtener circuito asignado
  const result = await conn.query(
    'SELECT num_circuito FROM FUNCIONARIO WHERE ci = ?',
    [funcionarioCI]
  );
  
  if (result.length === 0 || !result[0].NUM_CIRCUITO) {
    return res.status(404).json({ error: 'Funcionario sin circuito asignado' });
  }
  
  const circuito = result[0].NUM_CIRCUITO;
  
  // Votos no observados agrupados por condición (incluyendo BLANCO)
  const condiciones = await conn.query(`
    SELECT condicion, COUNT(*) as cantidad
    FROM VOTO
    WHERE num_circuito = ? AND esObservado = 0
    GROUP BY condicion
  `, [circuito]);
  
  // Observados
  const observados = await conn.query(`
    SELECT COUNT(*) as cantidad
    FROM VOTO
    WHERE num_circuito = ? AND esObservado = 1
  `, [circuito]);
  
  // Votos por lista (solo si tiene lista asociada)
  const porLista = await conn.query(`
    SELECT L.numero AS numero_lista, P.nombre AS partido, COUNT(*) as cantidad
    FROM VOTO V
    JOIN LISTA L ON V.numero_lista = L.numero
    JOIN PARTIDO P ON L.nombre_partido = P.nombre
    WHERE V.num_circuito = ?
    GROUP BY L.numero, P.nombre
    ORDER BY cantidad DESC
  `, [circuito]);
  
  const total = await conn.query(`
    SELECT COUNT(*) as total FROM VOTO WHERE num_circuito = ?
  `, [circuito]);
  
  conn.closeSync();
  
  res.json({
    circuito,
    observados: observados[0]?.CANTIDAD || 0,
    condiciones: condiciones.map(c => ({
      condicion: c.CONDICION, // ej: 'VALIDO', 'ANULADO', 'BLANCO'
      cantidad: c.CANTIDAD
    })),
    listas: porLista.map(l => ({
      numero_lista: l.NUMERO_LISTA,
      partido: l.PARTIDO,
      cantidad: l.CANTIDAD
    })),
    total: total[0]?.TOTAL || 0
  });
  } catch (error) {
  res.status(500).json({ error: 'Error al obtener resumen', detalle: error.message });
  }
  }

async function cerrarVotacion(req, res) {
const funcionarioCI = req.user.ci;

try {
const conn = await getConnection();
const resultado = await conn.query(
  `SELECT num_circuito FROM FUNCIONARIO WHERE ci = ?`,
  [funcionarioCI]
);

if (resultado.length === 0) {
  conn.closeSync();
  return res.status(404).json({ error: 'Funcionario sin circuito asignado' });
}

const num_circuito = resultado[0].NUM_CIRCUITO;

await conn.query(
  `UPDATE CIRCUITO SET cerrado = 1 WHERE num_circuito = ?`,
  [num_circuito]
);

conn.closeSync();

res.json({ mensaje: `Votación cerrada exitosamente para el circuito ${num_circuito}` });
} catch (error) {
res.status(500).json({ error: 'Error al cerrar votación', detalle: error.message });
}
}

module.exports = { obtenerResumen, cerrarVotacion };


