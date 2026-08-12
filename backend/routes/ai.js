const express = require('express');
const router = express.Router();
const { estimatePrice, matchProviders, analyzeSentiment, forecast, summarizeProvider, noshowRisk, suggestTimes } = require('../controllers/aiController');
const { protect, staffOnly } = require('../middleware/auth');

router.post('/estimate-price', estimatePrice);
router.post('/match-providers', matchProviders);
router.get('/sentiment/:providerId', analyzeSentiment);
router.get('/summary/:providerId', summarizeProvider);
router.get('/noshow-risk', protect, staffOnly, noshowRisk);
router.post('/suggest-times', suggestTimes);
router.get('/forecast', protect, staffOnly, forecast);

module.exports = router;
