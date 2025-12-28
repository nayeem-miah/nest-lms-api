import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'src/config/cloudinary.config'


export const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'users/profile',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [
                { width: 500, height: 500, crop: 'fill' },
                { quality: 'auto' },
            ],
        };
    },
});


export const courseThumbnailStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'courses/thumbnails',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [
                { width: 1280, height: 720, crop: 'limit' },
                { quality: 'auto' },
            ],
        };
    },
});


export const courseVideoStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'courses/videos',
            resource_type: 'video',
            allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
        };
    },
});