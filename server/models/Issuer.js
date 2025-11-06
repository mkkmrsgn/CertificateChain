// models/Issuer.js
const mongoose = require('mongoose');

const issuerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String // for demo only (hash later)
});

module.exports = mongoose.model('Issuer', issuerSchema);
