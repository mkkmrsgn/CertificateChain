const express = require('express');
const router = express.Router();
const Issuer = require('../models/Issuer');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Issuer.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const newIssuer = new Issuer({ name, email, password }); // plain for now
    await newIssuer.save();
    res.json({ success: true, message: 'Issuer registered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const issuer = await Issuer.findOne({ email, password });
    if (!issuer) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ success: true, issuerId: issuer._id, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
