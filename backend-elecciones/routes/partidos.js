const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { crearPartido, eliminarPartido, obtenerPartidos } = require('../controllers/partidosController');

router.get('/', verificarToken, obtenerPartidos);
router.post('/', verificarToken, verificarRol('ADMIN'), crearPartido);
router.delete('/:nombre', verificarToken, verificarRol('ADMIN'), eliminarPartido);

module.exports = router;