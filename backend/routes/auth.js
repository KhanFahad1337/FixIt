const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, registerProvider, loginProvider, loginAdmin, updateProfile, getMe,
  loginSubAdmin, createSubAdmin, getSubAdmins, deleteSubAdmin,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/provider/register', registerProvider);
router.post('/provider/login', loginProvider);
router.post('/admin/login', loginAdmin);
router.post('/subadmin/login', loginSubAdmin);
router.post('/subadmin/create', protect, adminOnly, createSubAdmin);
router.get('/subadmins', protect, adminOnly, getSubAdmins);
router.delete('/subadmin/:id', protect, adminOnly, deleteSubAdmin);
router.put('/profile', protect, updateProfile);
router.get('/me', protect, getMe);

module.exports = router;
