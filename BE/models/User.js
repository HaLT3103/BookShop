const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId : Number,
  name: String,
  age: Number,
  phone: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
