const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// دالة توليد JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d',
    });
};

// 1. تسجيل حساب جديد (Signup)
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // التحقق هل المستخدم موجود مسبقاً
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
        }

        // تشفير كلمة المرور (Hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // إنشاء المستخدم الجديد
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                message: 'تم تسجيل الحساب بنجاح'
            });
        } else {
            res.status(400).json({ message: 'بيانات المستخدم غير صالحة' });
        }
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

// 2. تسجيل الدخول (Login)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث عن المستخدم بالبريد الإلكتروني
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // مقارنة كلمة المرور المدخلة بالمشفرة في الداتا بيس
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            message: 'تم تسجيل الدخول بنجاح'
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
}; 