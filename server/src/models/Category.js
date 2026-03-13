const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
}, { _id: true });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: '📦' }, // emoji icon (legacy fallback)
    image: { type: String }, // dynamic uploaded image path
    subcategories: [subcategorySchema],
}, { timestamps: true });

// Auto-generate slug from name before saving
categorySchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
});

module.exports = mongoose.model('Category', categorySchema);
