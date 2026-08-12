const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
}, { timestamps: true });

favoriteSchema.index({ user: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
