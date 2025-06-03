const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  defaultAddress: { type: String, required: true },
  otherAddresses: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
