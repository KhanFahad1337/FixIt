const express = require('express');
const router = express.Router();
const { getProviders, getProviderById, updateProviderProfile } = require('../controllers/providerController');
const { protect } = require('../middleware/auth');

router.get('/', getProviders);
router.get('/:id', getProviderById);
router.put('/:id', protect, updateProviderProfile);

module.exports = router;
