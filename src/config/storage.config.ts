import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  driver: process.env.STORAGE_DRIVER || 'local',
  local: {
    uploadPath: process.env.LOCAL_UPLOAD_PATH || './uploads',
  },
  s3: {
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
}));
