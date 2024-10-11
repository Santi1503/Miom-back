const express = require('express');
const router = express.Router();
const { getAllExams, createExam, getExamById } = require('../controllers/examController');

router.get('/', getAllExams);  // Obtener todos los exámenes
router.post('/', createExam);  // Crear un nuevo examen
router.get('/:id', getExamById);  // Obtener un examen por su ID

module.exports = router;