const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
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
  ticketCode: {
    type: String,
    required: true,
    unique: true // Unique UUID/hash for QR check-in
  },
  qrCodeUrl: String, // Data URL or Cloudinary path to the generated QR code image
  isCheckedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', TicketSchema);
