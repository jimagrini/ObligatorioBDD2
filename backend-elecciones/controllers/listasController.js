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

const insertLista = async (req, res) => {
  try {
    const conn = await getConnection();
    const { numero, nombre_partido } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!numero || !nombre_partido) {
      return res.status(400).json({
        success: false,
        message: 'Los campos numero y nombre_partido son requeridos'
      });
    }

    // Validar que numero sea un entero
    if (!Number.isInteger(Number(numero))) {
      return res.status(400).json({
        success: false,
        message: 'El campo numero debe ser un entero válido'
      });
    }

    // Aquí debes usar tu ORM/biblioteca de base de datos
    // Ejemplo con consulta SQL directa (ajusta según tu configuración):
    
    // Opción 1: Con query SQL directo
    const query = 'INSERT INTO LISTA (NUMERO, NOMBRE_PARTIDO) VALUES (?, ?)';
    const result = await conn.query(query, [numero, nombre_partido]);
    conn.closeSync();

    res.status(201).json({
      success: true,
      message: 'Lista creada exitosamente',
      data: {
        numero: numero,
        nombre_partido: nombre_partido
      }
    });

  } catch (error) {
    console.error('Error al insertar lista:', error);
    
    // Manejar errores específicos de base de datos
    if (error.code === 'ER_DUP_ENTRY' || error.code === 23000) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una lista con ese número'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear la lista'
    });
  }
};

const eliminarLista = async (req, res) => {
const { numero } = req.params;

try {
const conn = await getConnection();
// Verificar que la lista existe
const [existe] = await conn.query('SELECT 1 FROM LISTA WHERE NUMERO = ?', [numero]);
if (!existe) {
  conn.closeSync();
  return res.status(404).json({ error: 'Lista no encontrada' });
}

// Eliminar la lista
await conn.query('DELETE FROM LISTA WHERE NUMERO = ?', [numero]);
conn.closeSync();

res.json({ success: true, message: 'Lista eliminada correctamente' });
} catch (error) {
res.status(500).json({ error: 'Error al eliminar lista', detail: error.message });
}
};


module.exports = { obtenerListas, insertLista, eliminarLista};
