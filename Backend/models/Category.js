const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: String,
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400'
  },
  icon: {
    type: String,
    default: 'Sparkles' // name of lucide-react icon
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
