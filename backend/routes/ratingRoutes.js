const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- User Routes (Login වූ අය පමණි) ---
router.post('/products/:productId/ratings', protect, ratingController.submitRating);

// --- Public Routes (කවුරුත් බැලීමට හැක) ---
router.get('/products/:productId/ratings', ratingController.getRatings);

// --- Admin Routes (Admin පමණි) ---
router.delete('/admin/ratings/:id', protect, adminOnly, ratingController.deleteRating);
router.put('/admin/ratings/:id/reply', protect, adminOnly, ratingController.replyRating);

module.exports = router; 