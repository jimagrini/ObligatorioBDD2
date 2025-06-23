const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { obtenerListas } = require('../controllers/listasController');

router.get('/', verificarToken, obtenerListas);

module.exports = router;
