const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  verifierEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
