const { getConnection } = require('../db/connection');
const bcrypt = require('bcrypt');

async function registrarCiudadano(req, res) {
const { ci, nombre, fecha_nac, cc, username, password } = req.body;

if (!ci || !nombre || !fecha_nac || !cc || !username || !password) {
return res.status(400).json({ error: 'Faltan datos requeridos' });
}

try {
const conn = await getConnection();

// Verificar si la cédula ya existe
const ciudadanoExistente = await conn.query(
  'SELECT 1 FROM CIUDADANO WHERE ci = ?',
  [ci]
);
if (ciudadanoExistente.length > 0) {
  return res.status(409).json({ error: 'Ya existe un ciudadano con esa cédula' });
}

// Verificar si el username ya existe
const usuarioExistente = await conn.query(
  'SELECT 1 FROM USUARIO WHERE username = ?',
  [username]
);
if (usuarioExistente.length > 0) {
  return res.status(409).json({ error: 'Ya existe un usuario con ese nombre de usuario' });
}

// Verificar si la credencial cívica ya fue usada (opcional)
const ccExistente = await conn.query(
  'SELECT 1 FROM HABILITADO_A_VOTAR WHERE cc = ?',
  [cc]
);
if (ccExistente.length > 0) {
  return res.status(409).json({ error: 'Ya existe un registro con esa credencial cívica' });
}

// Obtener un circuito aleatorio
const circuitos = await conn.query('SELECT num_circuito FROM CIRCUITO');
if (circuitos.length === 0) {
  return res.status(500).json({ error: 'No hay circuitos disponibles para asignar' });
}

const randomIndex = Math.floor(Math.random() * circuitos.length);
const num_circuito = circuitos[randomIndex].NUM_CIRCUITO;

// Insertar en CIUDADANO
await conn.query(
  'INSERT INTO CIUDADANO (ci, fecha_nac, nombre) VALUES (?, ?, ?)',
  [ci, fecha_nac, nombre]
);

// Insertar en HABILITADO_A_VOTAR
await conn.query(
  'INSERT INTO HABILITADO_A_VOTAR (ci, cc, num_circuito) VALUES (?, ?, ?)',
  [ci, cc, num_circuito]
);

// Hashear la contraseña
const hashedPassword = await bcrypt.hash(password, 10);

// Insertar en USUARIO
await conn.query(
  'INSERT INTO USUARIO (username, password_hash, rol, ci) VALUES (?, ?, ?, ?)',
  [username, hashedPassword, 'CIUDADANO', ci]
);

conn.closeSync();

res.status(201).json({ message: '✅ Ciudadano registrado correctamente' });
} catch (error) {
console.error('Error al registrar ciudadano:', error);
res.status(500).json({
error: 'Error al registrar ciudadano',
detalle: error.message
});
}
}

async function obtenerCiudadanos(req, res) {
  try {
    const conn = await getConnection();
    const ciudadanos = await conn.query('SELECT * FROM CIUDADANO');
    conn.closeSync();
    res.json(ciudadanos);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al obtener ciudadanos', detalle: error.message });
  }
}

module.exports = {
  registrarCiudadano,
  obtenerCiudadanos,
};
