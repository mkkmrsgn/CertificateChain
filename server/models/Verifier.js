const mongoose = require('mongoose');

const verifierSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain text for now (or use bcrypt later)
});

module.exports = mongoose.model('Verifier', verifierSchema);
