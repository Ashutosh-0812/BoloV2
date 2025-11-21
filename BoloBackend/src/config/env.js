const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  OTP_SERVICE_PROVIDER: process.env.OTP_SERVICE_PROVIDER || 'mock',
  SMS_FROM: process.env.SMS_FROM || 'VoiceApp',
  OCR_API_URL: process.env.OCR_API_URL,
  OCR_ACCESS_TOKEN: process.env.OCR_ACCESS_TOKEN,
  ASR_API_URL: process.env.ASR_API_URL,
  ASR_ACCESS_TOKEN: process.env.ASR_ACCESS_TOKEN,
  MT_API_URL: process.env.MT_API_URL,
  MT_ACCESS_TOKEN: process.env.MT_ACCESS_TOKEN
};
