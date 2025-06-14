const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userIdStr: { type: String }, 
  items: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
      bookIdStr: { type: String }, 
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
