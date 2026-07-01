const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary only if variables are defined in environment
const isConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Uploads a local file to Cloudinary and deletes it locally.
 * Falls back to returning the local path if Cloudinary is not configured.
 * 
 * @param {string} localFilePath - Path of the locally saved file.
 * @returns {Promise<string>} - The cloud URL or the local relative path.
 */
const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    if (!isConfigured()) {
      // Fallback: return the relative path for local serving
      const normPath = localFilePath.replace(/\\/g, '/');
      const idx = normPath.indexOf('/uploads');
      if (idx !== -1) {
        return normPath.substring(idx);
      }
      return `/uploads/${path.basename(localFilePath)}`;
    }

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: 'eventsphere_uploads',
      resource_type: 'auto'
    });

    // Delete local temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // On error, fallback to returning the relative path so the app doesn't break
    try {
      const normPath = localFilePath.replace(/\\/g, '/');
      const idx = normPath.indexOf('/uploads');
      if (idx !== -1) {
        return normPath.substring(idx);
      }
      return `/uploads/${path.basename(localFilePath)}`;
    } catch (e) {
      return null;
    }
  }
};

module.exports = { uploadToCloudinary, isCloudinaryConfigured: isConfigured };
