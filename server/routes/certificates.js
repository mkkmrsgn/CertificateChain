const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const User = require('../models/User');
const Certificate = require('../models/Certificate');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Helper to hash file buffer
function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  const { userName, issuerId, type, description } = req.body;
  const file = req.file;

  if (!userName || !issuerId || !type || !file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find user by name
    const user = await User.findOne({ name: userName });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Hash the uploaded file
    const fileBuffer = fs.readFileSync(file.path);
    const fileHash = hashBuffer(fileBuffer);

    // Create certificate record
    const cert = new Certificate({
      userId: user._id,
      issuerId,
      type,
      description,
      filePath: file.path,
      fileHash,
      issuedAt: new Date()
    });

    await cert.save();
    res.json({ success: true, message: 'Certificate uploaded and recorded' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
