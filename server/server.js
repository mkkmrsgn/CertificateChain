// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const issuerRoutes = require('./routes/issuer');
const verifierRoutes = require('./routes/verifier');
const requestRoutes = require('./routes/request');
const webauthnRoutes = require('./routes/webauthn');

const app = express();

// Environment-driven config
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/certificate_chain';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/issuer', issuerRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/verifier', verifierRoutes);
app.use('/uploads/certificates', express.static('uploads/certificates'));
app.use('/api/requests', requestRoutes);
app.use('/api/webauthn', webauthnRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
