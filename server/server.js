// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import API routes
const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const issuerRoutes = require('./routes/issuer');
const verifierRoutes = require('./routes/verifier');
const requestRoutes = require('./routes/request');
const webauthnRoutes = require('./routes/webauthn');

const app = express();

// Environment config
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/certificate_chain';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Serve API routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/issuer', issuerRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/webauthn', webauthnRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
app.use('/uploads/certificates', express.static('uploads/certificates'));

// Serve React frontend
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// Catch-all route for React (must be after API routes)
app.get('*', (req, res) => {
  // If request URL starts with /api, send 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
