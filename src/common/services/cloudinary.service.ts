
import { Injectable } from '@nestjs/common';
import cloudinary from 'src/config/cloudinary.config';


@Injectable()
export class CloudinaryService {
    // Delete file
    async deleteFile(publicId: string): Promise<any> {
        try {
            return await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw error;
        }
    }

    //Delete video specifically
    async deleteVideo(publicId: string): Promise<any> {
        try {
            return await cloudinary.uploader.destroy(publicId, {
                resource_type: 'video',
            });
        } catch (error) {
            console.error('Cloudinary video delete error:', error);
            throw error;
        }
    }

    // Get file details
    async getFileDetails(publicId: string): Promise<any> {
        try {
            return await cloudinary.api.resource(publicId);
        } catch (error) {
            console.error('Cloudinary get file error:', error);
            throw error;
        }
    }
}