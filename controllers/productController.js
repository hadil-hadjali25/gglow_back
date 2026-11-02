const Product = require('../models/Product');

// 1. جلب المنتجات مع التصفية (Filtering) والبحث (Search)
const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let queryObj = {};

        // التصفية حسب الفئة
        if (category) {
            queryObj.category = category;
        }

        // البحث بالاسم
        if (search) {
            queryObj.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(queryObj);
        res.status(200).json({
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في جلب المنتجات', error: error.message });
    }
};

// 2. إنشاء منتج جديد
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
};

// 3. جلب منتج واحد بواسطة الـ ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

// 4. تعديل منتج بواسطة الـ ID
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'المنتج غير موجود للتعديل' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'فشل في تحديث بيانات المنتج', error: error.message });
    }
};

// 5. حذف منتج بواسطة الـ ID
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'المنتج غير موجود للحذف' });
        }
        res.status(200).json({ message: 'تم حذف المنتج بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم أثناء الحذف', error: error.message });
    }
};

// تصدير جميع الدوال بسلام
module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};