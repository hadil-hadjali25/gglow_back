const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// مسار التسجيل: POST /api/users/signup
router.post('/signup', registerUser);

// مسار تسجيل الدخول: POST /api/users/login
router.post('/login', loginUser);

module.exports = router; 