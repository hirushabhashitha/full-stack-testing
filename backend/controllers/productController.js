const productService = require('../services/productService');
const Product = require('../models/Product'); // 👈 ඉතා වැදගත්: Product Model එක මෙතැන require කළ යුතුය!

// 1. Product එකක් Save කිරීම
const createProduct = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id || req.user || req.userId;

    if (!currentUserId) {
      return res.status(401).json({ error: 'Not authorized, user ID missing in token' });
    }

    const savedProduct = await productService.createProduct(req.body, currentUserId);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: 'Error adding product to database' });
  }
};

// 2. Admin Portal සඳහා Products ලබා ගැනීම
const getProducts = async (req, res) => {
  try {
    // Service එක හරහා සියලුම products ගෙන ඒම
    const products = await productService.getProductsByUser();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// 3. Shop එක සඳහා සියලුම Products ලබා ගැනීම (Public Route /shop සඳහා)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: 'Error fetching all products' });
  }
};

// 4. Product එකක් Update කිරීම
const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.userId, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

// 5. Product එකක් Delete කිරීම
const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id, req.userId);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

// සියලුම functions නිවැරදිව Export කිරීම
module.exports = {
  createProduct,
  getProducts,
  getAllProducts,
  updateProduct,
  deleteProduct
};