const express = require('express');
const Order = require('../../models/Order');
const { authMiddleware } = require('../user/authUserRoutes');

const router = express.Router();

// Lấy tất cả đơn hàng (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId addressId items.bookId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Cập nhật trạng thái đơn hàng (admin)
router.put('/admin/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Xóa đơn hàng (admin)
router.delete('/admin/:orderId', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    res.json({ message: 'Đã xóa đơn hàng!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

module.exports = router;