const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'lips'] },
    stock: { type: Number, required: true, default: 0 },
    image: [{ type: String }], // روابط الصور
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);