const express = require('express');
const router = express.Router();
const {
  createBooking, getUserBookings, getBookingById,
  updateBookingStatus, cancelBooking, getProviderBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/provider/:providerId', protect, getProviderBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
