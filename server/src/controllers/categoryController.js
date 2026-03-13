const Category = require('../models/Category');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
/**
 * GET /api/categories
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías.' });
    }
};

/**
 * POST /api/categories (protected)
 */
const createCategory = async (req, res) => {
    try {
        const { name, icon, subcategories } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        const exists = await Category.findOne({ slug });
        if (exists) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre.' });
        }

        const upload = require('../middleware/upload');
        const categoryData = { 
            name, 
            slug, 
            icon: icon || '📦', 
            subcategories: subcategories ? JSON.parse(subcategories) : [] 
        };

        if (req.file) {
            categoryData.image = upload.isCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
        }

        const category = new Category(categoryData);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al crear la categoría.' });
    }
};

/**
 * PUT /api/categories/:id (protected)
 */
const updateCategory = async (req, res) => {
    try {
        const { name, icon, subcategories, removeImage } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        const update = {};
        if (name) {
            update.name = name;
            update.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        }
        if (icon) update.icon = icon;
        if (subcategories) update.subcategories = typeof subcategories === 'string' ? JSON.parse(subcategories) : subcategories;

        const upload = require('../middleware/upload');
        // Image handling
        if (req.file) {
            update.image = upload.isCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
        } else if (removeImage === 'true') {
             update.image = null;
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar la categoría.' });
    }
};

/**
 * DELETE /api/categories/:id (protected)
 * Validates no products are linked
 */
const deleteCategory = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                message: `No se puede eliminar: existen ${productCount} producto(s) en esta categoría.`,
            });
        }

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });

        // Note: For now we don't delete from Cloudinary to avoid accidentally deleting needed images.

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Categoría eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría.' });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
