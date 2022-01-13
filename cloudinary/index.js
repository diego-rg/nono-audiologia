const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'nono',
        resource_type: 'auto',
        allowedFormats: ['jpeg', 'png', 'jpg', 'mp3'],
        transformation: [
            {width: 500, height: 500, crop: "fill"}
        ]
    }
});

module.exports = { cloudinary, storage }