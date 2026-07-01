const mongoose = require('mongoose');

let isFallbackMode = false;

const connectDB = async () => {
  if (process.env.FORCE_MOCK === 'true') {
    console.log('🚀 FORCE_MOCK active: Running in Fallback Mode (In-Memory Database / Mock JSON storage)');
    isFallbackMode = true;
    return;
  }

  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // fail fast if not running
    });
    console.log('✨ MongoDB Connected successfully');
    isFallbackMode = false;
  } catch (err) {
    console.error('⚠️ MongoDB Connection Failed:', err.message);
    console.log('🚀 Running in Fallback Mode (In-Memory Database / Mock JSON storage)');
    isFallbackMode = true;
  }
};

const getFallbackMode = () => isFallbackMode;

module.exports = { connectDB, getFallbackMode };
