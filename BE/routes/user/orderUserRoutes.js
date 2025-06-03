const express = require('express');
const Order = require('../../models/Order');
const { authMiddleware } = require('./authUserRoutes');

const router = express.Router();

// Lấy tất cả đơn hàng của user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền truy cập!' });
    }
    const orders = await Order.find({ userId: req.params.userId }).populate('items.bookId addressId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Tạo đơn hàng mới
router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const { items, addressId, paymentMethod, note } = req.body;
    const order = new Order({
      userId: req.params.userId,
      items,
      addressId,
      paymentMethod,
      note,
      status: 'pending' // luôn khởi tạo với trạng thái đã đặt hàng
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Cập nhật đơn hàng (ví dụ: cập nhật trạng thái, ghi chú)
router.put('/:userId/:orderId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const { status, note } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, userId: req.params.userId },
      { status, note },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Xóa đơn hàng
router.delete('/:userId/:orderId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const order = await Order.findOneAndDelete({ _id: req.params.orderId, userId: req.params.userId });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    res.json({ message: 'Đã xóa đơn hàng!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

module.exports = router;
