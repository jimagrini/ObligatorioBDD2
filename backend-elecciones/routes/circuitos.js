const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { obtenerCircuitos } = require('../controllers/circuitosController');
const {obtenerVotosPorCircuito} = require(`../controllers/eleccionesController`)
router.get('/', verificarToken, obtenerCircuitos);
router.get('/elecciones/:idEleccion/circuitos/votos', verificarToken, verificarRol('ADMIN'), obtenerVotosPorCircuito);
module.exports = router;
