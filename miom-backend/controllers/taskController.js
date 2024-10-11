const Task = require('../models/Task');  // Asegúrate de tener el modelo de Task

// Obtener todas las tareas
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();  // Suponiendo que uses Sequelize
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error obteniendo las tareas' });
  }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  try {
    const newTask = await Task.create({
      title,
      description,
      dueDate,
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error creando la tarea' });
  }
};

// Obtener una tarea por su ID
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);  // Buscar por ID
    if (!task) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error obteniendo la tarea' });
  }
};

module.exports = { getAllTasks, createTask, getTaskById };
