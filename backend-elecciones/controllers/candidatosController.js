const { getConnection } = require('../db/connection');

async function obtenerCandidatos(req, res) {
try {
const conn = await getConnection();
const result = await conn.query('SELECT C.CI, P.NUMERO_LISTA, P.ORGANO_DEL_ESTADO, P.ORDEN_EN_LA_LISTA FROM CANDIDATO C JOIN PERTENECE_A_LISTA P ON C.CI = P.CI_CANDIDATO' );
conn.closeSync();
res.json(result);
} catch (error) {
res.status(500).json({ error: 'Error al obtener candidatos', detalle: error.message });
}
}

async function insertarCandidato(req, res) {
const { ci, numero_lista, organo_del_estado, orden_en_la_lista } = req.body;

if (!ci || !numero_lista || !organo_del_estado || !orden_en_la_lista) {
return res.status(400).json({ error: 'Faltan datos requeridos' });
}

try {
const conn = await getConnection();
await conn.query('INSERT INTO CANDIDATO (CI) VALUES (?)', [ci]);
await conn.query('INSERT INTO PERTENECE_A_LISTA (CI_CANDIDATO, NUMERO_LISTA, ORGANO_DEL_ESTADO, ORDEN_EN_LA_LISTA) VALUES (?, ?, ?, ?)',
[ci, numero_lista, organo_del_estado, orden_en_la_lista]
);
conn.closeSync();
res.status(201).json({ message: 'Candidato registrado correctamente' });
} catch (error) {
res.status(500).json({ error: 'Error al registrar candidato', detalle: error.message });
}
}

async function eliminarCandidato(req, res) {
const { ci } = req.params;

try {
const conn = await getConnection();
await conn.query('DELETE FROM PERTENECE_A_LISTA WHERE CI_CANDIDATO = ?', [ci]);
await conn.query('DELETE FROM CANDIDATO WHERE CI = ?', [ci]);
conn.closeSync();
res.json({ message: 'Candidato eliminado correctamente' });
} catch (error) {
res.status(500).json({ error: 'Error al eliminar candidato', detalle: error.message });
}
}

module.exports = {
obtenerCandidatos,
insertarCandidato,
eliminarCandidato
};