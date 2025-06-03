const express = require('express');
const Address = require('../../models/Address');
const { authMiddleware } = require('./authUserRoutes');

const router = express.Router();

// Lấy tất cả địa chỉ của user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền truy cập!' });
    }
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Thêm địa chỉ mới
router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const { defaultAddress, otherAddresses } = req.body;
    const address = new Address({
      userId: req.params.userId,
      defaultAddress,
      otherAddresses: otherAddresses || []
    });
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Cập nhật địa chỉ
router.put('/:userId/:addressId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const { defaultAddress, otherAddresses } = req.body;
    const address = await Address.findOneAndUpdate(
      { _id: req.params.addressId, userId: req.params.userId },
      { defaultAddress, otherAddresses },
      { new: true }
    );
    if (!address) return res.status(404).json({ message: 'Không tìm thấy địa chỉ!' });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Xóa địa chỉ
router.delete('/:userId/:addressId', authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Không có quyền thao tác!' });
    }
    const address = await Address.findOneAndDelete({ _id: req.params.addressId, userId: req.params.userId });
    if (!address) return res.status(404).json({ message: 'Không tìm thấy địa chỉ!' });
    res.json({ message: 'Đã xóa địa chỉ!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

module.exports = router;
