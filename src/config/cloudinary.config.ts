import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
import configuration from 'src/config/configuration';

const config = configuration();

cloudinary.config({
    cloud_name: configuration().cloudinary.cloudName,
    api_key: configuration().cloudinary.apiKey,
    api_secret: configuration().cloudinary.apiSecret,
});

export default cloudinary;
