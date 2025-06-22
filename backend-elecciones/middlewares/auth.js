const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secreto123';



function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload; // ahora podemos acceder a req.user.rol, etc.
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

function verificarRol(rolEsperado) {
  return (req, res, next) => {
    if (req.user.rol !== rolEsperado) {
      return res.status(403).json({ error: 'Acceso denegado: rol incorrecto' });
    }
    next();
  };
}

module.exports = { verificarToken, verificarRol };


