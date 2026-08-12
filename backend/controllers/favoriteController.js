const Favorite = require('../models/Favorite');
const ServiceProvider = require('../models/ServiceProvider');

exports.toggleFavorite = async (req, res) => {
  try {
    const { providerId } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, provider: providerId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ favorited: false });
    }
    await Favorite.create({ user: req.user._id, provider: providerId });
    res.json({ favorited: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'provider',
        select: 'name profession pricePerHour rating experience description isAvailable',
      })
      .sort('-createdAt');
    res.json(favorites.map(f => f.provider));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({ user: req.user._id, provider: req.params.providerId });
    res.json({ favorited: !!existing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
