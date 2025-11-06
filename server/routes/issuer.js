const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Certificate = require('../models/Certificate'); // ✅ ADD THIS

// Set up multer for certificate uploads
const storage = multer.diskStorage({
  destination: 'uploads/certificates/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Upload certificate and link to student
router.post('/upload', upload.single('certificate'), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  const { studentName } = req.body;
  const file = req.file;

  if (!studentName || !file) {
    return res.status(400).json({ error: 'Student name and certificate file are required' });
  }

  try {
    const user = await User.findOne({ name: studentName });
    if (!user) return res.status(404).json({ error: 'Student not found' });

    const newCert = new Certificate({
      studentId: user._id,
      filePath: file.path,
    });

    await newCert.save();
    res.status(201).json({ message: 'Certificate uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

// Verify a certificate by student name
router.get('/verify', async (req, res) => {
  const { name } = req.query;

  if (!name) return res.status(400).json({ error: 'Student name is required' });

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ error: 'Student not found' });

    const cert = await Certificate.findOne({ studentId: user._id });
    if (!cert) return res.status(404).json({ error: 'No certificate found for this student' });

    res.status(200).json({ filePath: cert.filePath });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

module.exports = router;
