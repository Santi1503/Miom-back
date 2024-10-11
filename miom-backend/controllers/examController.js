const Exam = require('../models/Exam');  // Asegúrate de tener el modelo de Exam

// Obtener todos los exámenes
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error obteniendo los exámenes' });
  }
};

// Crear un nuevo examen
const createExam = async (req, res) => {
  const { subject, date } = req.body;

  try {
    const newExam = await Exam.create({
      subject,
      date,
    });
    res.status(201).json(newExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error creando el examen' });
  }
};

// Obtener un examen por su ID
const getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ msg: 'Examen no encontrado' });
    }
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error obteniendo el examen' });
  }
};

module.exports = { getAllExams, createExam, getExamById };
