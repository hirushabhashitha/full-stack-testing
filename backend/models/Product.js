// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // කවුද Seller කියලා බලාගන්න
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String },
  stock: { type: Number, default: 1 },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  ratingsCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);