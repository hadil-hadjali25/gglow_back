const jwt = require('jsonwebtoken');
const User = require('../models/User'); // تأكدي من المسار الصحيح لملف الـ User Model

const protect = async (req, res, next) => {
  let token;

  // 1. التثبت إذا كان الـ Header يحتوي على Authorization يبدأ بـ Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. استخراج التوكن من الهيدر (بعد كلمة Bearer)
      token = req.headers.authorization.split(' ')[1];

      // 3. فك تشفير التوكن والتحقق من صحته
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');      // 4. جلب بيانات المستخدم من قاعدة البيانات (بدون كلمة المرور) وإضافته للطلب
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'المستخدم غير موجود' });
      }

      next(); // المتابعة للـ Route التالي (Order Route)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'غير مصرح لك، التوكن غير صالح' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'غير مصرح لك، لا يوجد توكن' });
  }
};

module.exports = { protect };
