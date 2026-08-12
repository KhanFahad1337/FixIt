const mongoose = require('mongoose');

const noShowReportSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  action: {
    type: String,
    enum: ['refund', 'rebook', 'both'],
    default: 'refund',
  },
  rebookProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', default: null },
  adminNote: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('NoShowReport', noShowReportSchema);
