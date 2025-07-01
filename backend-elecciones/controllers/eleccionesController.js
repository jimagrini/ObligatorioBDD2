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

const insertarEleccion = async (req, res) => {
  try {
    const conn = await getConnection();
    const { id_eleccion, fecha_realizacion, tipo_eleccion } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!id_eleccion || !fecha_realizacion || !tipo_eleccion) {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_eleccion, fecha_realizacion y tipo_eleccion son requeridos'
      });
    }

    // Validar que id_eleccion sea un entero
    if (!Number.isInteger(Number(id_eleccion))) {
      return res.status(400).json({
        success: false,
        message: 'El campo id_eleccion debe ser un entero válido'
      });
    }

    // Validar que la fecha sea válida
    const fecha = new Date(fecha_realizacion);
    if (isNaN(fecha.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'La fecha proporcionada no es válida'
      });
    }

    // Validar tipos de elección comunes (ajusta según tus necesidades)
    const tiposValidos = [
      'Elecciones Departamentales', 
      'Elecciones Nacionales', 
      'Elecciones Internas', 
      'Plebiscito', 
      'Referendum'
    ];
    
    if (!tiposValidos.includes(tipo_eleccion)) {
      return res.status(400).json({
        success: false,
        message: `Tipo de elección no válido. Tipos permitidos: ${tiposValidos.join(', ')}`
      });
    }

    const query = 'INSERT INTO ELECCION (ID_ELECCION, FECHA_REALIZACION, TIPO_ELECCION) VALUES (?, ?, ?)';
    const [result] = await conn.query(query, [id_eleccion, fecha_realizacion, tipo_eleccion]);
    conn.closeSync();
    res.status(201).json({
      success: true,
      message: 'Elección creada exitosamente',
      data: {
        id_eleccion: id_eleccion,
        fecha_realizacion: fecha_realizacion,
        tipo_eleccion: tipo_eleccion
      }
    });

  } catch (error) {
    console.error('Error al insertar elección:', error);
    
    // Manejar errores específicos de base de datos
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una elección con esa fecha y tipo'
      });
    }

    if (error.code === 'ER_DATA_TOO_LONG' || error.code === '22001') {
      return res.status(400).json({
        success: false,
        message: 'Los datos proporcionados son demasiado largos'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear la elección'
    });
  }
};

async function obtenerCircuitosPorEleccion(req, res) {
  const { idEleccion } = req.params;

  try {
    const conn = await getConnection();
    const result = await conn.query(`
      SELECT DISTINCT C.NUM_CIRCUITO, E.DIRECCION, Z.CIUDAD, Z.DEPARTAMENTO
      FROM VOTO V
      JOIN CIRCUITO C ON V.NUM_CIRCUITO = C.NUM_CIRCUITO
      JOIN ESTABLECIMIENTO E ON C.ID_ESTABLECIMIENTO = E.ID
      JOIN ZONA Z ON E.ID_ZONA = Z.ID
      WHERE V.ID_ELECCION = ?
    `, [idEleccion]);

    conn.closeSync();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener circuitos', detalle: error.message });
  }
}

async function obtenerVotosPorCircuito(req, res) {
  const { idEleccion } = req.params;

  try {
    const conn = await getConnection();

    const result = await conn.query(`
      SELECT 
        V.num_circuito,
        C.cerrado,
        SUM(CASE WHEN V.condicion = 'VALIDO' THEN 1 ELSE 0 END) AS validos,
        SUM(CASE WHEN V.condicion = 'ANULADO' THEN 1 ELSE 0 END) AS anulados,
        SUM(CASE WHEN V.esObservado = 1 THEN 1 ELSE 0 END) AS observados,
        COUNT(*) AS total
      FROM VOTO V
      JOIN CIRCUITO C ON V.num_circuito = C.num_circuito
      WHERE V.id_eleccion = ?
      GROUP BY V.num_circuito, C.cerrado
      ORDER BY V.num_circuito
    `, [idEleccion]);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener votos por circuito',
      detalle: error.message
    });
  }
}

async function obtenerResultadosTotalesEleccion(req, res) {
const { idEleccion } = req.params;
try {
const conn = await getConnection();
const result = await conn.query('SELECT V.ID_ELECCION, V.NUMERO_LISTA, L.NOMBRE_PARTIDO, COUNT(*) AS TOTAL_VOTOS FROM VOTO V JOIN LISTA L ON V.NUMERO_LISTA = L.NUMERO WHERE V.ID_ELECCION = ? GROUP BY V.ID_ELECCION, V.NUMERO_LISTA, L.NOMBRE_PARTIDO ORDER BY TOTAL_VOTOS DESC' , [idEleccion]);


// Calcular total general
const totalGeneral = result.reduce((acc, r) => acc + parseInt(r.TOTAL_VOTOS), 0);

// Agregar porcentaje a cada fila
const resultadosConPorcentaje = result.map(r => ({
  ...r,
  PORCENTAJE: totalGeneral > 0 ? ((r.TOTAL_VOTOS / totalGeneral) * 100).toFixed(2) : '0.00'
}));

const ganador = resultadosConPorcentaje[0] || null;

conn.closeSync();

res.json({
  total: totalGeneral,
  ganador,
  resultados: resultadosConPorcentaje
});
} catch (error) {
res.status(500).json({ error: 'Error al obtener resultados de la elección', detalle: error.message });
}
}

async function obtenerVotosDeCircuito(req, res) {
  const { idEleccion, numCircuito } = req.params;
  try {
    const conn = await getConnection();

    // Obtener totales
    const [totales] = await conn.query(`
      SELECT 
        V.num_circuito,
        SUM(CASE WHEN V.condicion = 'VALIDO' THEN 1 ELSE 0 END) AS validos,
        SUM(CASE WHEN V.condicion = 'ANULADO' THEN 1 ELSE 0 END) AS anulados,
        SUM(CASE WHEN V.esObservado = true THEN 1 ELSE 0 END) AS observados,
        COUNT(*) AS total,
        C.cerrado
      FROM VOTO V
      JOIN CIRCUITO C ON V.num_circuito = C.num_circuito
      WHERE V.id_eleccion = ? AND V.num_circuito = ?
      GROUP BY V.num_circuito, C.cerrado
    `, [idEleccion, numCircuito]);

    // Obtener votos por lista
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

    res.json({
      ...totales,
      LISTAS: listas
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener resultados del circuito',
      detalle: error.message
    });
  }
}





module.exports = { obtenerElecciones, insertarEleccion, obtenerCircuitosPorEleccion, obtenerVotosPorCircuito, obtenerResultadosTotalesEleccion, obtenerVotosDeCircuito};

