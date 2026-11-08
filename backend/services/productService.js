const Product = require('../models/Product');

class ProductService {
  // 1. අලුත් Product එකක් සේව් කිරීමේ සේවාව
  async createProduct(productData, userId) {
    const newProduct = new Product({
      ...productData,
      userId: userId
    });
    
    // Database එකේ සේව් කර ප්‍රතිඵලය ආපසු යැවීම
    return await newProduct.save();
  }

  // 2. Admin Portal එක සඳහා සියලුම Products ලබා ගැනීමේ සේවාව (userId filter එක ඉවත් කර ඇත)
  async getProductsByUser(userId) {
    // Admin පමණක් products දමන නිසා, සියලුම products ලබා දෙයි
    const products = await Product.find({}); 
    console.log("Fetched All Products from DB:", products);
    return products;
  }

  // 3. Product එකක් Update කිරීම (Admin Portal සඳහා අවශ්‍ය නම් userId චෙක් කිරීම ඉවත් කළ හැක, එහෙත් ආරක්ෂාවට තැබිය හැක)
  async updateProduct(productId, userId, updateData) {
    return await Product.findOneAndUpdate(
      { _id: productId },
      updateData,
      { new: true }
    );
  }

  // 4. Product එකක් Delete කිරීම
  async deleteProduct(productId, userId) {
    return await Product.findOneAndDelete({ _id: productId });
  }

}

module.exports = new ProductService();