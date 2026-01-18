import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage configuration
export const storageConfig = {
    type: process.env.STORAGE_TYPE || 'local', // 'local' or 's3'

    // Local storage settings
    local: {
        uploadsDir: path.join(__dirname, '../../uploads'),
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    },

    // S3 settings (for future use)
    s3: {
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION || 'us-east-1',
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    }
};

// Initialize local storage directories
export const initializeStorage = async () => {
    if (storageConfig.type === 'local') {
        const dirs = [
            storageConfig.local.uploadsDir,
            path.join(storageConfig.local.uploadsDir, 'avatars'),
            path.join(storageConfig.local.uploadsDir, 'course-thumbnails'),
            path.join(storageConfig.local.uploadsDir, 'certificates'),
            path.join(storageConfig.local.uploadsDir, 'recordings'),
            path.join(storageConfig.local.uploadsDir, 'files')
        ];

        for (const dir of dirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                console.error(`Failed to create directory ${dir}:`, error.message);
            }
        }

        console.log('✅ Storage directories initialized');
    }
};

export default storageConfig;
