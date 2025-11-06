const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require("ethers");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------------------
// 🔑 Hybrid Mode Config
// ------------------------------
const CONTRACT_ADDRESS = "YOUR_LOCAL_CONTRACT_ADDRESS"; // update after deploy
const ABI = require("./artifacts/contracts/CertificateIssuer.sol/CertificateIssuer.json").abi;

// Connect to local Hardhat node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use one of Hardhat accounts (private key) as signer
const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// ------------------------------
// 📝 API Endpoints
// ------------------------------

// Register user
app.post('/register', async (req, res) => {
  try {
    const { userAddress } = req.body;
    const tx = await contract.registerUser(userAddress);
    await tx.wait();
    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Issue certificate
app.post('/issue', async (req, res) => {
  try {
    const { userAddress, certHash } = req.body;
    const tx = await contract.issueCertificate(userAddress, certHash);
    await tx.wait();
    res.json({ success: true, message: "Certificate issued" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify certificate
app.post('/verify', async (req, res) => {
  try {
    const { userAddress, uploadedHash } = req.body;
    const isValid = await contract.verifyCertificate(userAddress, uploadedHash);
    res.json({ isValid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("✅ API running on http://localhost:3001"));
