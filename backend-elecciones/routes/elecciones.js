const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { obtenerElecciones, insertarEleccion } = require('../controllers/eleccionesController');

router.get('/', verificarToken, obtenerElecciones);

router.post('/insertarEleccion', verificarToken, verificarRol("FUNCIONARIO"), insertarEleccion);


module.exports = router;
