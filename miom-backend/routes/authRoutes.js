const express = require('express');
const { registerUser, loginUser, updateUserRole, getAllUsers, sendPasswordResetEmail, resetPassword  } = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta de registro
router.post('/register', registerUser);

// Ruta de inicio de sesión
router.post('/login', loginUser);

// Ruta para actualizar el rol de un usuario (solo superadmin puede acceder)
router.put('/update-role/:id', verifyToken, checkRole(['superadmin']), updateUserRole);

// Ruta para obtener todos los usuarios (solo superadmin puede acceder)
router.get('/users', verifyToken, checkRole(['superadmin']), getAllUsers);

// Ruta para recuperar la contraseña de los usuarios
router.post('/forgot-password', sendPasswordResetEmail);

router.post('/reset-password', resetPassword);

module.exports = router;
