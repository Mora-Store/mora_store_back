const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/login
 * Authenticates admin user and returns JWT token
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * POST /api/auth/logout
 * Stateless JWT logout (client clears token)
 */
const logout = (req, res) => {
    res.json({ message: 'Sesión cerrada correctamente.' });
};

module.exports = { login, logout };
