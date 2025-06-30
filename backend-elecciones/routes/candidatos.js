const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
obtenerCandidatos,
insertarCandidato,
eliminarCandidato
} = require('../controllers/candidatosController');

router.get('/', verificarToken, verificarRol('ADMIN'), obtenerCandidatos);
router.post('/', verificarToken, verificarRol('ADMIN'), insertarCandidato);
router.delete('/:ci', verificarToken, verificarRol('ADMIN'), eliminarCandidato);

module.exports = router;