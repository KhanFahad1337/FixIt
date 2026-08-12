const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFavorites);
router.post('/toggle', protect, toggleFavorite);
router.get('/check/:providerId', protect, checkFavorite);

module.exports = router;
