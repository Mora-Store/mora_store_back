const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Rate limit login to 10 attempts per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.' },
});

router.post('/login', loginLimiter, login);
router.post('/logout', logout);

module.exports = router;
