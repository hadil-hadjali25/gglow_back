// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const { protect } = require('../middleware/authMiddleware'); // دالة التحقق من التوكن (تأكد أن اسمها مط عندك)

// @desc    إنشاء طلب جديد
// @route   POST /api/orders
// @access  Private (مخصص للمستخدمين المسجلين فقط)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'لا توجد منتجات في السلة' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id, // الـ ID متاع المستخدم اللي جابوه الـ Middleware متاع التوكن
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم: ' + error.message });
  }
});

module.exports = router;