const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // اسم المنتج
    purchasePrice: { type: Number, required: true }, // سعر الشراء
    salePrice: { type: Number, required: true }, // سعر البيع
    quantity: { type: Number, required: true }, // الكمية
    image: { type: String, required: false }, // صورة المنتج (رابط)
    category: { type: String, required: true }, // الفئة
}, {
    timestamps: true // يضيف createdAt و updatedAt تلقائياً
});

module.exports = mongoose.model('Product', productSchema);
