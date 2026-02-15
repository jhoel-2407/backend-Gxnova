const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary se configura automáticamente si CLOUDINARY_URL está en .env
// Pero por si acaso, verificamos que exista
if (!process.env.CLOUDINARY_URL) {
    console.warn("ADVERTENCIA: CLOUDINARY_URL no está definida en .env");
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gxnova_trabajos', // Nombre de la carpeta en Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Opcional: redimensionar
    },
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es una imagen! Por favor sube solo imágenes.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limite de 10MB
    }
});

module.exports = upload;
