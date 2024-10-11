const express = require('express');
const router = express.Router();
const { getAllNotes, createNote, getNoteById } = require('../controllers/noteController');

router.get('/', getAllNotes);  // Obtener todos los apuntes
router.post('/', createNote);  // Crear un nuevo apunte
router.get('/:id', getNoteById);  // Obtener un apunte por su ID

module.exports = router;
