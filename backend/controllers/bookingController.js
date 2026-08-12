const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
const Review = require('../models/Review');

exports.createBooking = async (req, res) => {
  try {
    const { provider, service, date, time, address, description, hours } = req.body;
    const providerData = await ServiceProvider.findById(provider);
    if (!providerData) return res.status(404).json({ message: 'Provider not found' });

    const totalAmount = providerData.pricePerHour * hours;
    const booking = await Booking.create({
      user: req.user._id,
      provider,
      service,
      date,
      time,
      address,
      description,
      hours,
      totalAmount,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('provider', 'name profession pricePerHour')
      .populate('service', 'name')
      .sort('-createdAt');

    const reviews = await Review.find({ user: req.user._id }).select('booking');
    const reviewedIds = new Set(reviews.map(r => r.booking.toString()));

    const data = bookings.map(b => ({
      ...b.toObject(),
      hasReviewed: reviewedIds.has(b._id.toString()),
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.params.providerId })
      .populate('user', 'name phone address')
      .populate('service', 'name')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name phone address')
      .populate('provider', 'name profession pricePerHour')
      .populate('service', 'name');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
