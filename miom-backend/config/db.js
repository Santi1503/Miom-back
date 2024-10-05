const { Sequelize } = require('sequelize');
require('dotenv').config(); // Cargar las variables de entorno

// Crear una nueva instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,         
  process.env.DB_USER,         
  process.env.DB_PASSWORD,     
  {
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT, 
    dialect: 'mysql',   
  }
);

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos en Railway');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
