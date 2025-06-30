const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { obtenerElecciones, insertarEleccion, obtenerCircuitosPorEleccion } = require('../controllers/eleccionesController');
const { obtenerVotosPorCircuito,obtenerResultadosTotalesEleccion } = require('../controllers/eleccionesController');

router.get('/', verificarToken, obtenerElecciones);
router.post('/insertarEleccion', verificarToken, verificarRol("ADMIN"), insertarEleccion);
router.get('/:idEleccion/circuitos', verificarToken, verificarRol('ADMIN'), obtenerCircuitosPorEleccion);

router.get('/:idEleccion/circuitos/votos', verificarToken, verificarRol('ADMIN'), obtenerVotosPorCircuito);
router.get('/:idEleccion/resultados', verificarToken, verificarRol('ADMIN'), obtenerResultadosTotalesEleccion);

module.exports = router;
