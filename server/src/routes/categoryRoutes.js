const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getCategories);
router.post('/', authMiddleware, upload.single('image'), createCategory);
router.put('/:id', authMiddleware, upload.single('image'), updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
