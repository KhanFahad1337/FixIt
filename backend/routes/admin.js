const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getSubAdminStats, getChartData, getAllUsers, getAllProviders,
  getAllBookings, approveProvider, toggleProviderStatus,
  deleteProvider, deleteUser, deleteBooking,
} = require('../controllers/adminController');
const { protect, adminOnly, staffOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/subadmin-stats', protect, staffOnly, getSubAdminStats);
router.get('/chart', protect, adminOnly, getChartData);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/providers', protect, adminOnly, getAllProviders);
router.get('/bookings', protect, staffOnly, getAllBookings);
router.put('/providers/:id/approve', protect, adminOnly, approveProvider);
router.put('/providers/:id/toggle-status', protect, adminOnly, toggleProviderStatus);
router.delete('/providers/:id', protect, adminOnly, deleteProvider);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.delete('/bookings/:id', protect, staffOnly, deleteBooking);

module.exports = router;
