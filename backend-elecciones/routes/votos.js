const express = require('express');
const router = express.Router();
const { registrarVoto } = require('../controllers/votosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

// Solo funcionarios pueden registrar votos
router.post(
'/',
verificarToken,
verificarRol('FUNCIONARIO'),
registrarVoto
);

module.exports = router;


