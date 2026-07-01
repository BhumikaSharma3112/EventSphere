const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 160
  },
  category: {
    type: String, // String representation e.g. 'Gala', 'Wellness' etc.
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    enum: ['venue', 'online'],
    default: 'venue'
  },
  location: {
    type: String, // Venue address or Online URL
    required: true
  },
  city: {
    type: String,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200'
  },
  galleryImages: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    default: 0 // 0 means Free
  },
  capacity: {
    type: Number,
    required: true
  },
  ticketsSold: {
    type: Number,
    default: 0
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'published'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
