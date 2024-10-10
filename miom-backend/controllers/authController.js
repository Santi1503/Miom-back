const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuario
const registerUser = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Asignar el rol basado en el correo u otra lógica
    const role = email === process.env.SUPERADMIN_EMAIL ? 'superadmin' : 'user';

    // Crear un nuevo usuario en la base de datos
    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    // Crear un token JWT
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  try {
    // Buscar el usuario por ID
    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar que el rol sea válido (solo superadmin y user)
    const validRoles = ['user', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Rol no válido' });
    }

    // Actualizar el rol del usuario
    user.role = role;
    await user.save();

    res.json({ msg: 'Rol actualizado correctamente', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'createdAt'],  // Devuelve solo los campos necesarios
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: 'No se encontró ningún usuario con este correo' });
    }

    // Generar un token de recuperación
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Configurar el enlace de recuperación
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Puedes usar otro servicio como Outlook, Mailgun, etc.
      auth: {
        user: process.env.EMAIL_USER, // Asegúrate de configurar estas variables en .env
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Configuración del mensaje de correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recupera tu contraseña',
      html: `
        <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
        <a href="${resetLink}">Recuperar contraseña</a>
      `, // Aquí usamos HTML en lugar de texto plano
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Enlace de recuperación enviado al correo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar al usuario
    const user = await User.findByPk(decoded.id)
    if(!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' })
    }

    // Cifrar la contrasña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Actualizar la conraseña en la base de datos
    user.password = hashedPassword
    await user.save()
    res.json({ msg: 'Contraseña actualizada correctamente'})
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Error al actualizar la contraseña' })
  }
}


module.exports = { registerUser, loginUser, updateUserRole, getAllUsers, sendPasswordResetEmail, resetPassword };