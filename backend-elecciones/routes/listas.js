const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { obtenerListas, insertLista, eliminarLista } = require('../controllers/listasController');

router.get('/', verificarToken, obtenerListas);

router.post('/insertarLista', verificarToken, verificarRol('ADMIN') , insertLista);

router.delete('/:numero', verificarToken, verificarRol('ADMIN'), eliminarLista);

module.exports = router;
