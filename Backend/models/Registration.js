const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketCount: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid'
  },
  paymentId: String,
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', RegistrationSchema);
