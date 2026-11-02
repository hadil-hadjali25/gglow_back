const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


// Middleware
app.use(express.json());
const cors = require('cors');
app.use(cors());

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const orderRoutes = require('./routes/orderRoutes');
// ...
app.use('/api/orders', orderRoutes);
// Database Connection
const mongoURI = process.env.MONGO_URI ||
 'mongodb://localhost:27017/gglow-cosmetic';

mongoose.connect(mongoURI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ Database connection error:', err));

const multer = require('multer');
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// تحديد وين باش تتخزن الصور (مثلاً مجلد اسمه uploads في الباك إند)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // لازم تتأكدي أن المجلد هذا موجود أو الباك إند ينشئو
  },
  filename: function (req, file, cb) {
    // نعطيو اسم فريد للصورة باش ما يصيرش تشابه (التاريخ الحالي + اسم الملف الأصلي)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// تفعيل مجلد uploads باش يقدر المتصفح يوصل للصور عبر الرابط (Static folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
    res.send('Welcome to Gglow Cosmetic API 💄✨');
});

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});