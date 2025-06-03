const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  title: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  cover: String
}, { _id: false });

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  addressId: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  paymentMethod: { type: String, required: true },
  note: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
