const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subcategory: { type: String, default: '', trim: true },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    // Discount percentage (0 = no discount, 20 = 20% off)
    discount: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true });

// Regex-friendly indexes (no $text index — we use $regex for prefix search)
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);
