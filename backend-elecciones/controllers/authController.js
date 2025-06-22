const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getConnection } = require('../db/connection');

const SECRET_KEY = process.env.JWT_SECRET || 'secreto123';

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const conn = await getConnection();
    const query = 'SELECT * FROM USUARIO WHERE username = ?';
    const result = await conn.query(query, [username]);

    console.log('Resultado de DB:', result);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result[0];
    console.log('Usuario encontrado:', usuario);
    console.log('Hash de contraseña:', usuario.PASSWORD_HASH);

    if (!usuario.PASSWORD_HASH) {
      return res.status(500).json({ error: 'El usuario no tiene contraseña registrada en la base de datos.' });
    }


    console.log('Password recibido del body:', password);
    console.log('Comparando:', password, 'vs', usuario.PASSWORD_HASH);
    const passwordValida = await bcrypt.compare(password,usuario.PASSWORD_HASH);
    console.log(passwordValida);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { username: usuario.USERNAME, ci: usuario.CI, rol: usuario.ROL },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({ token, rol: usuario.ROL });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno', detalle: error.message });
  }
}

module.exports = { login }; 
