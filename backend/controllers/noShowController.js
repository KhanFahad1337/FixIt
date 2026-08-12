const NoShowReport = require('../models/NoShowReport');
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
const Payment = require('../models/Payment');

exports.reportNoShow = async (req, res) => {
  try {
    const { bookingId, action, description } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const existing = await NoShowReport.findOne({ booking: bookingId });
    if (existing) return res.status(400).json({ message: 'Report already filed for this booking' });

    const report = await NoShowReport.create({
      booking: bookingId,
      user: req.user._id,
      provider: booking.provider,
      action: action || 'refund',
      description,
    });

    await ServiceProvider.findByIdAndUpdate(booking.provider, {
      $inc: { missedAppointments: 1, penaltyPoints: 10 },
      isPenalized: true,
      penaltyUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isAvailable: false,
    });

    booking.status = 'cancelled';
    await booking.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await NoShowReport.find({ user: req.user._id })
      .populate('provider', 'name profession')
      .populate('booking', 'date time totalAmount')
      .sort('-createdAt');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await NoShowReport.find()
      .populate('user', 'name email')
      .populate('provider', 'name profession phone')
      .populate('booking', 'date time totalAmount')
      .sort('-createdAt');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveReport = async (req, res) => {
  try {
    const report = await NoShowReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = 'approved';
    await report.save();

    const booking = await Booking.findById(report.booking);
    if (booking) {
      booking.paymentStatus = 'refunded';
      await booking.save();
      await Payment.findOneAndUpdate(
        { booking: report.booking },
        { status: 'refunded' }
      );
    }

    await ServiceProvider.findByIdAndUpdate(report.provider, {
      $inc: { penaltyPoints: 20 },
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectReport = async (req, res) => {
  try {
    const report = await NoShowReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    report.status = 'rejected';
    report.adminNote = req.body.adminNote || 'Report rejected by admin';
    await report.save();

    await ServiceProvider.findByIdAndUpdate(report.provider, {
      $inc: { penaltyPoints: -10 },
      isPenalized: false,
      penaltyUntil: null,
      isAvailable: true,
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearPenalty = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { isPenalized: false, penaltyPoints: 0, penaltyUntil: null, isAvailable: true },
      { new: true }
    ).select('-password');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
