const express = require('express')
const { connectDB, sequelize } = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv')

// cargar las variables .env
dotenv.config()

// inicializar el servidor
const app = express()

// conectar base de datos 
connectDB()

// middleware mara analizar JSON
app.use(express.json())
app.use(cors())

// rutas de autenticacion
app.use('/api/auth', require('./routes/authRoutes'))

// sincornizar los modelos y luego levantar el servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch((err) => {
    console.error('Error sincronizando la base de datos:', err);
  });

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});