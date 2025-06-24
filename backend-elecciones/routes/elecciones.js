const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { obtenerElecciones } = require('../controllers/eleccionesController');

router.get('/', verificarToken, obtenerElecciones);

module.exports = router;