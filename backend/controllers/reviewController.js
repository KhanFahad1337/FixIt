const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');

exports.createReview = async (req, res) => {
  try {
    const { booking, rating, comment } = req.body;
    const bookingData = await Booking.findById(booking);
    if (!bookingData) return res.status(404).json({ message: 'Booking not found' });
    if (bookingData.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (bookingData.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    const existingReview = await Review.findOne({ booking });
    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed this booking' });
    }

    const review = await Review.create({
      booking,
      user: req.user._id,
      provider: bookingData.provider,
      rating,
      comment,
    });

    const reviews = await Review.find({ provider: bookingData.provider });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await ServiceProvider.findByIdAndUpdate(bookingData.provider, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
