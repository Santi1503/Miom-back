const Note = require('../models/Note');  // Asegúrate de tener el modelo de Note

// Obtener todos los apuntes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error obteniendo los apuntes' });
  }
};

// Crear un nuevo apunte
const createNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = await Note.create({
      title,
      content,
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error creando el apunte' });
  }
};

// Obtener un apunte por su ID
const getNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ msg: 'Apunte no encontrado' });
    }
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error obteniendo el apunte' });
  }
};

module.exports = { getAllNotes, createNote, getNoteById };
