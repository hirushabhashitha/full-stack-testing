const orderService = require('../services/orderService');

// 1. නව Order එකක් සෑදීම
const createOrder = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user;
    if (!userId) {
      return res.status(401).json({ error: 'Not authorized, user ID missing' });
    }

    const savedOrder = await orderService.createOrder(userId, req.body);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// 2. User ගේ Order ඉතිහාසය ලබා ගැනීම
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// 3. Admin සඳහා සියලුම Orders ලබා ගැනීම
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};

// 4. Order Status Update කිරීම (Approve / Reject)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, rejectionReason } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(orderId, status, rejectionReason);
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ error: err.message || 'Failed to update order status' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};