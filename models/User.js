const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب']
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'كلمة المرور مطلوبة']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);