const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderService {
  // 1. නව Order එකක් සෑදීම (User)
  async createOrder(userId, orderData) {
    const { items, shippingAddress, totalAmount } = orderData;
    
    const newOrder = new Order({
      user: userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    return await newOrder.save();
  }

  // 2. අදාළ User ගේ Orders ලැයිස්තුව ලබා ගැනීම (User Order History)
  async getUserOrders(userId) {
    return await Order.find({ user: userId })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
  }

  // 3. සියලුම Orders ලබා ගැනීම (Admin සඳහා)
  async getAllOrders() {
    return await Order.find({})
      .populate('user', 'username email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
  }

  // 4. Order Status එක Update කිරීම (Admin Approve / Reject & Stock Decrement)
  async updateOrderStatus(orderId, status, rejectionReason = '') {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Admin විසින් Confirmed කළ විට ස්වයංක්‍රීයව Stock එකෙන් ප්‍රමාණය අඩු කිරීම
    if (status === 'Confirmed' && order.status !== 'Confirmed') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    order.status = status;
    if (status === 'Rejected') {
      order.rejectionReason = rejectionReason;
    }

    return await order.save();
  }
}

module.exports = new OrderService();