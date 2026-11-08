const express = require('express');
const router = express.Router();

const { getAllUsers, toggleUserStatus, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/status', protect, adminOnly, toggleUserStatus);
router.delete('/users/:id', protect, adminOnly, deleteUser); // 👈 මෙහි :id නිවැරදිව යොදා ඇත

module.exports = router;