const express = require('express');
const router = express.Router();
const { registrarCiudadano, obtenerCiudadanos } = require('../controllers/ciudadanoController');

router.post('/ciudadanos', registrarCiudadano);
router.get('/ciudadanos', obtenerCiudadanos);

module.exports = router;
