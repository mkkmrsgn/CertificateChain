// server/server.js
require('dotenv').config({ path: '../.env' }); // load .env from root
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { JsonRpcProvider, Wallet, Contract } = require('ethers');
const fs = require('fs');

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

// Ethereum / Contract setup
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

// Load ABI
const ABI = require('../artifacts/contracts/CertificateIssuer.sol/CertificateIssuer.json').abi;
const contract = new Contract(CONTRACT_ADDRESS, ABI, wallet);

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

// Blockchain endpoints
// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { userAddress } = req.body;
    const tx = await contract.registerUser(userAddress);
    await tx.wait();
    res.json({ success: true, message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Issue a certificate
app.post('/api/issue', async (req, res) => {
  try {
    const { userAddress, certHash } = req.body;
    const tx = await contract.issueCertificate(userAddress, certHash);
    await tx.wait();
    res.json({ success: true, message: 'Certificate issued' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify a certificate
app.post('/api/verify', async (req, res) => {
  try {
    const { userAddress, uploadedHash } = req.body;
    const isValid = await contract.verifyCertificate(userAddress, uploadedHash);
    res.json({ isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
