const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  faceDescriptor: { type: [Number], required: true }, // stores 128-d face vector
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
