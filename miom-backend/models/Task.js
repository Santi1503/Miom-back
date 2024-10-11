const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');  // Asegúrate de que esté bien configurada tu conexión

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Task;
