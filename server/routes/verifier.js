const express = require('express');
const router = express.Router();
const Verifier = require('../models/Verifier');

// Simple register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existing = await Verifier.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const verifier = new Verifier({ username, password });
    await verifier.save();

    res.status(201).json({ message: 'Verifier registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Simple login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const verifier = await Verifier.findOne({ username });
    if (!verifier || verifier.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', verifierId: verifier._id });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
