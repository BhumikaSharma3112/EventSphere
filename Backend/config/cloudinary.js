const cloudinary = require('cloudinary').v2;

const isConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.log('📷 Cloudinary not configured. Uploads will fall back to local disk storage.');
}

const uploadToCloudinary = async (file, folder = 'eventsphere') => {
  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, { folder });
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      // fallback to local on error
    }
  }

  // Fallback: Return relative local path served by express static
  const localUrl = `/uploads/${file.filename}`;
  return {
    url: localUrl,
    public_id: `local_${file.filename}`
  };
};

module.exports = { uploadToCloudinary, isConfigured };
