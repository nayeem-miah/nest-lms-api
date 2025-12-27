import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'src/config/cloudinary.config';

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'users/profile',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        };
    },
});