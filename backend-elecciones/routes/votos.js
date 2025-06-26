const express = require('express');
const router = express.Router();
const { registrarVoto } = require('../controllers/votosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { obtenerVotos } = require('../controllers/votosController');

// Solo funcionarios pueden registrar votos
router.post(
'/registrarVoto',
verificarToken,
verificarRol('FUNCIONARIO'),
registrarVoto
);

// GET todos los votos - Solo para funcionarios
router.get('/', 
verificarToken, 
verificarRol('FUNCIONARIO'), 
obtenerVotos
);

module.exports = router;


