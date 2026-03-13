const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

/**
 * GET /api/products
 * Fetch all products with optional query filters:
 * - category (ObjectId), subcategory (string), featured (bool), search, available
 */
const getProducts = async (req, res) => {
    try {
        const { category, subcategory, featured, search, available } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (subcategory) filter.subcategory = subcategory;
        if (featured !== undefined) filter.featured = featured === 'true';
        if (available !== undefined) filter.available = available === 'true';
        else filter.available = true; // public API only shows available products by default

        if (search) {
            // Prefix/partial regex search — much smarter than $text
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(filter)
            .populate('category', 'name slug icon')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        console.error('getProducts error:', error);
        res.status(500).json({ message: 'Error al obtener productos.' });
    }
};

/**
 * GET /api/products/admin
 * Admin version: returns ALL products including unavailable
 */
const getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(filter)
            .populate('category', 'name slug icon')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        console.error('getAllProducts error:', error);
        res.status(500).json({ message: 'Error al obtener productos.' });
    }
};

/**
 * GET /api/products/:id
 */
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug icon');
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto.' });
    }
};

/**
 * POST /api/products (protected)
 */
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, featured, available, discount } = req.body;

        const product = new Product({
            name,
            description,
            price: parseFloat(price),
            category,
            subcategory,
            featured: featured === 'true' || featured === true,
            available: available !== 'false' && available !== false,
            discount: parseFloat(discount) || 0,
        });

        await product.save();
        await product.populate('category', 'name slug icon');
        res.status(201).json(product);
    } catch (error) {
        console.error('createProduct error:', error);
        res.status(400).json({ message: error.message || 'Error al crear el producto.' });
    }
};

/**
 * PUT /api/products/:id (protected)
 */
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, featured, available, images, discount } = req.body;

        const update = { name, description, subcategory };
        if (price !== undefined) update.price = parseFloat(price);
        if (category) update.category = category;
        if (featured !== undefined) update.featured = featured === 'true' || featured === true;
        if (available !== undefined) update.available = available === 'true' || available === true;
        if (images !== undefined) update.images = images;
        if (discount !== undefined) update.discount = parseFloat(discount) || 0;

        const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
            .populate('category', 'name slug icon');

        if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar el producto.' });
    }
};

/**
 * DELETE /api/products/:id (protected)
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

        // Note: With Cloudinary, we don't necessarily delete the images here unless we configure the Cloudinary API to do so.
        // For now, we just delete the product record and leave the image in Cloudinary or handle it via Cloudinary dashboard.

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    }
};

/**
 * POST /api/products/:id/images (protected)
 * Upload images for a product
 */
const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se recibieron imágenes.' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

        const upload = require('../middleware/upload');
        const imageUrls = req.files.map(f => 
            upload.isCloudinary ? f.path : `/uploads/${f.filename}`
        );
        product.images.push(...imageUrls);
        await product.save();
        await product.populate('category', 'name slug icon');

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al subir imágenes.' });
    }
};

/**
 * DELETE /api/products/:id/images/:filename (protected)
 * Remove a single image from a product
 */
const deleteImage = async (req, res) => {
    try {
        const { id, filename } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

        // Note: Not deleting from Cloudinary here to prevent accidental data loss.
        // If we wanted to, we'd use cloudinary.uploader.destroy(public_id) 

        // filename in this context is actually the full Cloudinary URL or what was stored.
        product.images = product.images.filter(img => img !== filename && img !== decodeURIComponent(filename));
        await product.save();
        await product.populate('category', 'name slug icon');

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la imagen.' });
    }
};

module.exports = { getProducts, getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImages, deleteImage };
