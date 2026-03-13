const express = require('express');
const router = express.Router();
const {
    getProducts, getAllProducts, getProduct,
    createProduct, updateProduct, deleteProduct,
    uploadImages, deleteImage
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/admin', authMiddleware, getAllProducts); // admin: no available filter
router.get('/:id', getProduct);

// Protected routes
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

// Image management
router.post('/:id/images', authMiddleware, upload.array('images', 10), uploadImages);
router.delete('/:id/images/:filename', authMiddleware, deleteImage);

module.exports = router;
