const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product'); // تأكدي أن مسار الـ Model صحيح عندك

// إعدادات الـ Multer لحفظ الصور
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route لجلب المنتجات من قاعدة البيانات
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // جلب المنتجات من قاعدة البيانات
        res.status(200).json({ products }); // إرجاعها على شكل JSON صحيح
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// صحيح ✅
router.get('/', async (req, res) => { res.send('Products route'); });

// خطأ ❌ (لأنه باش يولي هكا: /api/products/api/products ويصير 404)
router.get('/api/products', async (req, res) => { res.send('Products route'); });

// استعملي router.post بدل app.post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image: imagePath
        });

        await newProduct.save();
        res.status(201).json({ message: 'تم إضافة المنتج بنجاح', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;