const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Middleware එක import කිරීම (protect සහ adminOnly දෙකම එකම file එකෙන්)
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// 1. Seller Portal එක සඳහා (User ට අයත් ඒවා පමණක් / protect ඇත)
router.get('/', protect, productController.getProducts);

// 2. Shop එක සඳහා Public Route එක (සියලුම products පෙන්වීමට - protect නැත)

router.get('/shop', productController.getAllProducts);

// 3. Admin ට විතරක් Product එකක් Add කිරීමට (POST)
router.post('/', protect, adminOnly, productController.createProduct);

// 4. Admin ට විතරක් Product එකක් Update කිරීමට (PUT)
router.put('/:id', protect, adminOnly, productController.updateProduct);

// 5. Admin ට විතරක් Product එකක් Delete කිරීමට (DELETE)
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;