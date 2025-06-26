const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { obtenerCircuitos } = require('../controllers/circuitosController');

router.get('/', verificarToken, obtenerCircuitos);

module.exports = router;
