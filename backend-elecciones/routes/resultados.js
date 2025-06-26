const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { obtenerResultados } = require('../controllers/resultadosController');

router.get('/', verificarToken, obtenerResultados);

module.exports = router;