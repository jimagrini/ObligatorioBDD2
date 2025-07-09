const { getConnection } = require('../db/connection');

async function registrarVoto(req, res) {
  const { numero_lista, id_eleccion, condicion } = req.body;
  const ciudadanoCI = req.user?.ci;
  
  if (!ciudadanoCI || !id_eleccion || !condicion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const conn = await getConnection();

    // 1. Verificar si el ciudadano está habilitado para esta elección
    const habilitadoRes = await conn.query(
      'SELECT NUM_CIRCUITO FROM HABILITADO_A_VOTAR WHERE CI = ?',
      [ciudadanoCI]
    );
    if (habilitadoRes.length === 0) {
      return res.status(403).json({ error: 'El ciudadano no está habilitado para votar' });
    }
    const numCircuito = habilitadoRes[0].NUM_CIRCUITO;

    // 2. Verificar si ya votó en esta elección
    const yaVotoRes = await conn.query(
      'SELECT 1 FROM VOTACION_REALIZADA WHERE CI = ? AND ID_ELECCION = ?',
      [ciudadanoCI, id_eleccion]
    );
    if (yaVotoRes.length > 0) {
      return res.status(400).json({ error: 'El ciudadano ya votó en esta elección' });
    }

    // 3. Insertar el voto (sin CI, para mantener el secreto)
    // En vez de FECHA y HORA, insertamos un campo de "fecha de registro"
    const fechaRegistro = new Date().toISOString().split('T')[0]; // Solo la fecha

    const [votoResult] = await conn.query(
      `INSERT INTO VOTO (id_eleccion, condicion, esObservado, num_circuito, numero_lista) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_eleccion,
        condicion,
        0, // No observado (por defecto)
        numCircuito,
        condicion === 'VALIDO' ? numero_lista : null
      ]
    );

    // 4. Registrar en VOTACION_REALIZADA (con CI, para control obligatorio)
    await conn.query(
      'INSERT INTO VOTACION_REALIZADA (CI, ID_ELECCION) VALUES (?, ?)',
      [ciudadanoCI, id_eleccion]
    );

    res.status(201).json({ message: '✅ Voto registrado correctamente (secreto y obligatorio)' });

  } catch (error) {
    console.error('Error al registrar voto:', error);
    res.status(500).json({ error: 'Error al registrar el voto', detail: error.message });
  }
}



module.exports = {
registrarVoto
};