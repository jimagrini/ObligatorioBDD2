const express = require('express');
const router = express.Router();
const { registrarVoto } = require('../controllers/votosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');


// Solo funcionarios pueden registrar votos
router.post(
'/registrar',
verificarToken,
verificarRol('CIUDADANO'),
registrarVoto
);

// GET todos los votos - Solo para funcionarios
router.get('/', 
verificarToken, 
verificarRol('FUNCIONARIO'), 
);


    

module.exports = router;


