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
const result = await conn.query(`SELECT
P.nombre,
P.direccion,
P.ci_presidente,
P.ci_vicepresidente,
C1.nombre AS nombre_presidente,
C2.nombre AS nombre_vicepresidente
FROM PARTIDO P
LEFT JOIN CIUDADANO C1 ON P.ci_presidente = C1.ci
LEFT JOIN CIUDADANO C2 ON P.ci_vicepresidente = C2.ci;`);
conn.closeSync();
res.json(result);
} catch (error) {
res.status(500).json({ error: 'Error al obtener partidos', detalle: error.message });
}
}

module.exports = { crearPartido, eliminarPartido, obtenerPartidos };