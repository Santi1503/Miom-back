const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

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

        // Crear un nuevo usuario en la base de datos
        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
        });

        // Crear un token JWT
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
}

// Log in usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales invalidas' })
        }

        const isMatch = await bcrypt.comopare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: ' Credenciales invalidas' })
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
}

module.exports = { registerUser, loginUser }