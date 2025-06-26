const { getConnection } = require('../db/connection');

async function registrarVoto(req, res) {
const { ci, numero_lista, id_eleccion, condicion, esObservado } = req.body;
const funcionario = req.user; // extraído desde el token JWT

if (!ci || !numero_lista || !id_eleccion || !condicion) {
return res.status(400).json({ error: 'Faltan datos requeridos' });
}

try {
const conn = await getConnection();

const funcionarioCI = req.user?.ci;

if (!funcionarioCI) {
return res.status(401).json({ error: 'Token inválido o faltante' });
}

// 1. Obtener circuito del funcionario
const funcionarioResult = await conn.query('SELECT NUM_CIRCUITO FROM FUNCIONARIO WHERE VARCHAR(CI) = ?', [funcionarioCI]);
console.log(funcionarioResult)


if (funcionarioResult.length === 0 || !funcionarioResult[0].NUM_CIRCUITO) {
return res.status(403).json({ error: 'Funcionario sin circuito asignado' });
}

const circuitoFuncionario = funcionarioResult[0].NUM_CIRCUITO;

// 2. Verificar que el ciudadano esté habilitado a votar en el circuito del funcionario
const circuitoResult = await conn.query('SELECT * FROM HABILITADO_A_VOTAR WHERE ci = ? AND num_circuito = ?', [ci, circuitoFuncionario]);

if (circuitoResult.length === 0) {
return res.status(403).json({ error: 'El ciudadano no está habilitado en el circuito del funcionario' });
}


// 3. Verificar que no haya votado ya en esa elección
const yaVoto = await conn.query(`
  SELECT 1 FROM VOTO
  WHERE id_eleccion = ? AND numero_voto = ?
`, [id_eleccion, ci]);

if (yaVoto.length > 0) {
  return res.status(400).json({ error: 'El ciudadano ya emitió un voto en esta elección' });
}

// 4. Insertar el voto
const fecha = new Date().toISOString().split('T')[0];
const hora = new Date().toTimeString().split(' ')[0];

console.log({ ci, numero_lista, id_eleccion, circuitoFuncionario });

await conn.query(`
  INSERT INTO VOTO (
    numero_voto, fecha, hora, condicion,
    esObservado, id_eleccion, num_circuito, numero_lista
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`, [
  ci,  // Usamos el CI como identificador del voto
  fecha,
  hora,
  condicion,
  esObservado ? 1 : 0,
  id_eleccion,
  circuitoFuncionario,
  numero_lista
]);

res.status(201).json({ message: 'Voto registrado correctamente' });
} catch (error) {
console.error("Error en registrarVoto:", error);
res.status(500).json({ error: 'Error al registrar el voto', detail: error.message });
}
}

async function obtenerVotos(req, res) {
  try {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM VOTO');
    conn.closeSync();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener votos', detail: error.message });
  }
}



module.exports = { registrarVoto, obtenerVotos };