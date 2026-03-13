const mongoose = require('mongoose');

// Singleton settings document
const settingsSchema = new mongoose.Schema({
    whatsappNumber: { type: String, default: '5219991234567', trim: true },
    businessName: { type: String, default: 'Mi Catálogo', trim: true },
    logoUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
