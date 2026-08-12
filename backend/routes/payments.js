const express = require('express');
const router = express.Router();
const { processPayment, getPaymentByBooking } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, processPayment);
router.get('/:bookingId', protect, getPaymentByBooking);

module.exports = router;
