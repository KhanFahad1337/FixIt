const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  profession: { type: String, required: true },
  experience: { type: Number, default: 0 },
  description: { type: String },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  pricePerHour: { type: Number, required: true },
  image: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  missedAppointments: { type: Number, default: 0 },
  penaltyPoints: { type: Number, default: 0 },
  isPenalized: { type: Boolean, default: false },
  penaltyUntil: { type: Date, default: null },
}, { timestamps: true });

serviceProviderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

serviceProviderSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
