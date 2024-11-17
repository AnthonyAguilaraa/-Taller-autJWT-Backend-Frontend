const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Registrar un usuario
exports.registrarUsuario = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar usuario en la base de datos
        const query = `
            INSERT INTO users (username, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, username, email, role, created_at
        `;
        const values = [username, email, hashedPassword, role || 'user'];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Usuario registrado con éxito', user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ message: 'El nombre de usuario o email ya está en uso' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Iniciar sesión
exports.iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
