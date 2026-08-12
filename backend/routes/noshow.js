const express = require('express');
const router = express.Router();
const {
  reportNoShow, getMyReports, getAllReports,
  approveReport, rejectReport, clearPenalty,
} = require('../controllers/noShowController');
const { protect, staffOnly } = require('../middleware/auth');

router.post('/', protect, reportNoShow);
router.get('/my', protect, getMyReports);
router.get('/all', protect, staffOnly, getAllReports);
router.put('/:id/approve', protect, staffOnly, approveReport);
router.put('/:id/reject', protect, staffOnly, rejectReport);
router.put('/providers/:id/clear-penalty', protect, staffOnly, clearPenalty);

module.exports = router;
