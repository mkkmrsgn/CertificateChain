// server/routes/request.js
const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// Create a new verification request
router.post('/create', async (req, res) => {
  const { studentName, verifierEmail } = req.body;

  if (!studentName || !verifierEmail) {
    return res.status(400).json({ error: 'Missing studentName or verifierEmail' });
  }

  try {
    let existing = await Request.findOne({ studentName, verifierEmail });
    if (existing) return res.status(400).json({ error: 'Request already sent' });

    const newRequest = new Request({
      studentName,
      verifierEmail,
      status: 'pending'
    });

    await newRequest.save();
    res.json({ message: 'Request sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send request' });
  }
});

router.get('/pending', async (req, res) => {
  const { studentName } = req.query;
  console.log('🔍 Incoming studentName query:', studentName);

  try {
    const requests = await Request.find({ studentName, status: 'pending' });
    console.log('📦 Matched Requests:', requests);
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load requests' });
  }
});


// Approve or reject the request (from the student side)
router.post('/respond', async (req, res) => {
  const { studentName, verifierEmail, action } = req.body;

  if (!studentName || !verifierEmail || !['approved', 'rejected'].includes(action)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
  const updatedRequest = await Request.findOneAndUpdate(
    { studentName, verifierEmail },
    { status: action },
    { new: true }
  );

  if (!updatedRequest) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json({
    message: `Request ${action}`,
    request: updatedRequest
  });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to update request status' });
}
});

// Check verification status (used by verifier to check if approved)
router.get('/status', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing student name' });

  try {
    const requests = await Request.find({ studentName: name });
    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching request status' });
  }
});

module.exports = router;
