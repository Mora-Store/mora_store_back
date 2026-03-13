const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_CLOUD_NAME !== 'tu_cloud_name' &&
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_KEY !== 'tu_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'tu_api_secret';

let storage;

if (isCloudinaryConfigured) {
    // Production / Cloudinary Mode
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'mora-store',
            allowed_formats: ['jpeg', 'png', 'jpg', 'webp', 'gif'],
        },
    });
} else {
    // Local / Development Mode
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = path.extname(file.originalname);
            cb(null, `upload-${unique}${ext}`);
        },
    });
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Helper to determine if we are in Cloudinary mode
upload.isCloudinary = isCloudinaryConfigured;

module.exports = upload;
