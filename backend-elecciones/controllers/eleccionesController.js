const { getConnection } = require('../db/connection');

// 1. Obtener todas las elecciones
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

// 2. Insertar nueva elección
const insertarEleccion = async (req, res) => {
try {
const conn = await getConnection();
const { id_eleccion, fecha_realizacion, tipo_eleccion } = req.body;

if (!id_eleccion || !fecha_realizacion || !tipo_eleccion) {
  return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
}

const tiposValidos = ['Elecciones Departamentales', 'Elecciones Nacionales', 'Elecciones Internas', 'Plebiscito', 'Referendum'];
if (!tiposValidos.includes(tipo_eleccion)) {
  return res.status(400).json({ success: false, message: 'Tipo de elección inválido' });
}

await conn.query(
  'INSERT INTO ELECCION (ID_ELECCION, FECHA_REALIZACION, TIPO_ELECCION) VALUES (?, ?, ?)',
  [id_eleccion, fecha_realizacion, tipo_eleccion]
);
conn.closeSync();
res.status(201).json({ success: true, message: 'Elección creada exitosamente' });
} catch (error) {
res.status(500).json({ success: false, message: 'Error al insertar elección', detalle: error.message });
}
};

// 3. Obtener circuitos con votos de una elección
async function obtenerCircuitosPorEleccion(req, res) {
const { idEleccion } = req.params;
try {
const conn = await getConnection();
const result = await conn.query('SELECT DISTINCT C.NUM_CIRCUITO, E.DIRECCION, Z.CIUDAD, Z.DEPARTAMENTO FROM VOTO V JOIN CIRCUITO C ON V.NUM_CIRCUITO = C.NUM_CIRCUITO JOIN ESTABLECIMIENTO E ON C.ID_ESTABLECIMIENTO = E.ID JOIN ZONA Z ON E.ID_ZONA = Z.ID WHERE V.ID_ELECCION = ? ', [idEleccion]);
conn.closeSync();
res.json(result);
} catch (error) {
res.status(500).json({ error: 'Error al obtener circuitos', detalle: error.message });
}
}

// 4. Obtener resumen de votos por circuito
async function obtenerVotosPorCircuito(req, res) {
const { idEleccion } = req.params;
try {
const conn = await getConnection();
const result = await conn.query( `SELECT V.num_circuito, C.cerrado, SUM(CASE WHEN V.condicion = 'VALIDO' THEN 1 ELSE 0 END) AS validos, SUM(CASE WHEN V.condicion = 'ANULADO' THEN 1 ELSE 0 END) AS anulados, SUM(CASE WHEN V.condicion = 'BLANCO' THEN 1 ELSE 0 END) AS blancos, SUM(CASE WHEN V.esObservado = 1 THEN 1 ELSE 0 END) AS observados, COUNT(*) AS total FROM VOTO V JOIN CIRCUITO C ON V.num_circuito = C.num_circuito WHERE V.id_eleccion = ? GROUP BY V.num_circuito, C.cerrado ORDER BY V.num_circuito` , [idEleccion]);
conn.closeSync();
res.json(result);
} catch (error) {
res.status(500).json({ error: 'Error al obtener votos por circuito', detalle: error.message });
}
}

async function obtenerResultadosTotalesEleccion(req, res) {
const { idEleccion } = req.params;
try {
const conn = await getConnection();
// 1. Obtener resultados por lista con nombre del partido
const result = await conn.query(`
  SELECT 
    V.ID_ELECCION,
    V.NUMERO_LISTA,
    L.NOMBRE_PARTIDO,
    COUNT(*) AS TOTAL_VOTOS
  FROM VOTO V
  JOIN LISTA L ON V.NUMERO_LISTA = L.NUMERO
  WHERE V.ID_ELECCION = ? AND V.condicion = 'VALIDO'
  GROUP BY V.ID_ELECCION, V.NUMERO_LISTA, L.NOMBRE_PARTIDO
  ORDER BY TOTAL_VOTOS DESC
`, [idEleccion]);

const total = result.reduce((acc, r) => acc + Number(r.TOTAL_VOTOS), 0);

const resultados = result.map(r => ({
  ...r,
  PORCENTAJE: total > 0 ? ((r.TOTAL_VOTOS / total) * 100).toFixed(2) : '0.00'
}));

let ganador = resultados[0] || null;

// 2. Si hay ganador, obtener el nombre del presidente del partido
if (ganador) {
  const [presidenteResult] = await conn.query(`
    SELECT C.NOMBRE AS NOMBRE_PRESIDENTE
    FROM PARTIDO P
    JOIN CIUDADANO C ON P.CI_PRESIDENTE = C.CI
    WHERE P.NOMBRE = ?
  `, [ganador.NOMBRE_PARTIDO]);

  if (presidenteResult && presidenteResult.NOMBRE_PRESIDENTE) {
    ganador.NOMBRE_PRESIDENTE = presidenteResult.NOMBRE_PRESIDENTE;
  }
}

conn.closeSync();
res.json({ total, ganador, resultados });
} catch (error) {
console.error('Error al obtener resultados:', error);
res.status(500).json({ error: 'Error al obtener resultados de la elección', detalle: error.message });
}
}

// 6. Resultados detallados de un circuito
async function obtenerVotosDeCircuito(req, res) {
const { idEleccion, numCircuito } = req.params;
try {
const conn = await getConnection();

const [totales] = await conn.query(`
  SELECT 
    V.num_circuito,
    SUM(CASE WHEN V.condicion = 'VALIDO' THEN 1 ELSE 0 END) AS validos,
    SUM(CASE WHEN V.condicion = 'ANULADO' THEN 1 ELSE 0 END) AS anulados,
    SUM(CASE WHEN V.condicion = 'BLANCO' THEN 1 ELSE 0 END) AS blancos,
    SUM(CASE WHEN V.esObservado = 1 THEN 1 ELSE 0 END) AS observados,
    COUNT(*) AS total,
    C.cerrado
  FROM VOTO V
  JOIN CIRCUITO C ON V.num_circuito = C.num_circuito
  WHERE V.id_eleccion = ? AND V.num_circuito = ?
  GROUP BY V.num_circuito, C.cerrado
`, [idEleccion, numCircuito]);

const listas = await conn.query(`
  SELECT 
    V.numero_lista AS NUMERO_LISTA,
    L.nombre_partido AS NOMBRE_PARTIDO,
    COUNT(*) AS VOTOS
  FROM VOTO V
  JOIN LISTA L ON V.numero_lista = L.numero
  WHERE V.id_eleccion = ? AND V.num_circuito = ? AND V.condicion = 'VALIDO'
  GROUP BY V.numero_lista, L.nombre_partido
  ORDER BY VOTOS DESC
`, [idEleccion, numCircuito]);

conn.closeSync();
res.json({ ...totales, LISTAS: listas });
} catch (error) {
res.status(500).json({ error: 'Error al obtener resultados del circuito', detalle: error.message });
}
}


async function eliminarEleccion(req, res) {
  const { id } = req.params;
  
  try {
  const conn = await getConnection();

  // Primero verificamos si existe la elección
  const [eleccion] = await conn.query(
    'SELECT ID_ELECCION FROM ELECCION WHERE ID_ELECCION = ?',
    [id]
  );
  
  if (!eleccion) {
    conn.closeSync();
    return res.status(404).json({
      success: false,
      message: 'La elección especificada no existe',
    });
  }
  
  // Eliminamos la elección
  await conn.query('DELETE FROM ELECCION WHERE ID_ELECCION = ?', [id]);
  conn.closeSync();
  
  res.status(200).json({
    success: true,
    message: `Elección con ID ${id} eliminada exitosamente`,
  });
  } catch (error) {
  res.status(500).json({
  success: false,
  message: 'Error al eliminar la elección',
  detalle: error.message,
  });
  }
  }



module.exports = {
obtenerElecciones,
insertarEleccion,
obtenerCircuitosPorEleccion,
obtenerVotosPorCircuito,
obtenerResultadosTotalesEleccion,
obtenerVotosDeCircuito,
eliminarEleccion
};

