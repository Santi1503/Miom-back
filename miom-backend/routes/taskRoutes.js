const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskById } = require('../controllers/taskController');

router.get('/', getAllTasks);  // Obtener todas las tareas
router.post('/', createTask);  // Crear una nueva tarea
router.get('/:id', getTaskById);  // Obtener una tarea por su ID

module.exports = router;