const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
obtenerResumen,
//verificarVoto,
cerrarVotacion 
} = require('../controllers/funcionarioController');
router.post('/cerrar-votacion', verificarToken, verificarRol('FUNCIONARIO'), cerrarVotacion);
router.get('/resumen', verificarToken, verificarRol('FUNCIONARIO'), obtenerResumen);
//router.get('/verificar-voto', verificarToken, verificarRol('FUNCIONARIO'), verificarVoto);
module.exports = router;