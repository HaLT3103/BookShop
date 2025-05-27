const express = require('express');
const Cart = require('../models/Cart');
const Book = require('../models/Book');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Lấy giỏ hàng của user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền truy cập giỏ hàng này!' });
    }
    let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.bookId');
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Thêm sách vào giỏ hàng
router.post('/:userId/add', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const { bookId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ bookId, quantity });
    }
    await cart.save();
    cart = await Cart.findOne({ userId: req.params.userId }).populate('items.bookId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Xóa sách khỏi giỏ hàng
router.post('/:userId/remove', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const { bookId } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại!' });
    cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
    await cart.save();
    cart = await Cart.findOne({ userId: req.params.userId }).populate('items.bookId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Cập nhật số lượng sách trong giỏ hàng
router.post('/:userId/update', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const { bookId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại!' });
    const item = cart.items.find(item => item.bookId.toString() === bookId);
    if (!item) return res.status(404).json({ message: 'Sách không có trong giỏ hàng!' });
    item.quantity = quantity;
    await cart.save();
    cart = await Cart.findOne({ userId: req.params.userId }).populate('items.bookId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

module.exports = router;
