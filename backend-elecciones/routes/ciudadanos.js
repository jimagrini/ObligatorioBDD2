const express = require('express');
const router = express.Router();
const { registrarCiudadano, obtenerCiudadanos } = require('../controllers/ciudadanosController');

router.post('/registrar', registrarCiudadano);
router.get('/ciudadanos', obtenerCiudadanos);

module.exports = router;
