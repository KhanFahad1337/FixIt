const ServiceProvider = require('../models/ServiceProvider');

exports.getProviders = async (req, res) => {
  try {
    const filter = { isApproved: true };
    if (req.query.profession) filter.profession = req.query.profession;
    const providers = await ServiceProvider.find(filter).select('-password');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).select('-password');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProviderProfile = async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own profile' });
    }
    const allowed = ['name', 'phone', 'profession', 'experience', 'description', 'pricePerHour', 'image', 'isAvailable'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    ).select('-password');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
