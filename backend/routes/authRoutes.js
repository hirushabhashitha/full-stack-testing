const express = require('express');
const router = express.Router();


// Controllers import කිරීම
const {
  registerUser,
  verifyRegisterOtp,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout

} = require('../controllers/authController');

// Middleware import කිරීම
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- Protected Routes (User තමන්ගේ Profile එක බැලීමට, update කිරීමට හෝ delete කිරීමට) ---
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);



module.exports = router;