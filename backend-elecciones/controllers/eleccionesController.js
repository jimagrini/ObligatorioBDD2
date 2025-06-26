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


module.exports = { obtenerElecciones, insertarEleccion };

