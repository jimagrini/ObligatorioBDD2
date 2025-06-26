const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { obtenerListas, insertLista } = require('../controllers/listasController');

router.get('/', verificarToken, obtenerListas);

router.post('/insertarLista', verificarToken, verificarRol('FUNCIONARIO') , insertLista);


module.exports = router;
