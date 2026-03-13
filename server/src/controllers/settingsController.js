const Settings = require('../models/Settings');

/**
 * GET /api/settings
 */
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        // Create default settings if not exists
        if (!settings) {
            settings = await Settings.create({
                whatsappNumber: process.env.WHATSAPP_NUMBER || '5219991234567',
                businessName: 'Mi Catálogo',
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la configuración.' });
    }
};

/**
 * PUT /api/settings (protected)
 */
const updateSettings = async (req, res) => {
    try {
        const { whatsappNumber, businessName, logoUrl } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
        if (businessName !== undefined) settings.businessName = businessName;
        if (logoUrl !== undefined) settings.logoUrl = logoUrl;

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar la configuración.' });
    }
};

module.exports = { getSettings, updateSettings };
