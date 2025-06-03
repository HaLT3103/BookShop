const express = require('express');
const Address = require('../../models/Address');
const { authMiddleware } = require('../user/authUserRoutes');

const router = express.Router();

// Lấy tất cả địa chỉ (admin)
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.find({}).populate('userId');
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Xóa địa chỉ (admin)
router.delete('/admin/:addressId', async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Không tìm thấy địa chỉ!' });
    res.json({ message: 'Đã xóa địa chỉ!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Cập nhật địa chỉ (admin) - cho phép đổi defaultAddress và otherAddresses
router.put('/:addressId', async (req, res) => {
  try {
    const { defaultAddress, otherAddresses } = req.body;
    const address = await Address.findById(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Không tìm thấy địa chỉ!' });
    if (defaultAddress) address.defaultAddress = defaultAddress;
    if (otherAddresses) address.otherAddresses = otherAddresses;
    await address.save();
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

module.exports = router;