const { getConnection } = require('../db/connection');

async function crearPartido(req, res) {
const { nombre, direccion, ci_presidente, ci_vicepresidente } = req.body;

if (!nombre || !direccion || !ci_presidente || !ci_vicepresidente) {
return res.status(400).json({ error: 'Faltan datos requeridos' });
}

try {
const conn = await getConnection();
await conn.query(
`INSERT INTO PARTIDO (nombre, direccion, ci_presidente, ci_vicepresidente) VALUES (?, ?, ?, ?)`,
[nombre, direccion, ci_presidente, ci_vicepresidente]
);
conn.closeSync();
res.status(201).json({ message: 'Partido creado exitosamente' });
} catch (error) {
res.status(500).json({ error: 'Error al crear el partido', detalle: error.message });
}
}

async function eliminarPartido(req, res) {
const { nombre } = req.params;
try {
const conn = await getConnection();
await conn.query('DELETE FROM PARTIDO WHERE nombre = ?', [nombre]);
conn.closeSync();
res.json({ message: `Partido '${nombre}' eliminado correctamente` });
} catch (error) {
res.status(500).json({ error: 'Error al eliminar el partido', detalle: error.message });
}
}

async function obtenerPartidos(req, res) {
try {
const conn = await getConnection();
const result = await conn.query('SELECT * FROM PARTIDO');
conn.closeSync();
res.json(result);
} catch (error) {
res.status(500).json({ error: 'Error al obtener partidos', detalle: error.message });
}
}

module.exports = { crearPartido, eliminarPartido, obtenerPartidos };