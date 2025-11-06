const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { JsonRpcProvider, Wallet, Contract } = require("ethers"); // ✅ All ethers imports in one line
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✏️ UPDATE THESE
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ABI = require("./artifacts/contracts/CertificateIssuer.sol/CertificateIssuer.json").abi;
const provider = new JsonRpcProvider("http://localhost:8545");
const signer = provider.getSigner(); // School's Ethereum wallet
const contract = new Contract(CONTRACT_ADDRESS, ABI, signer); // ✅ Use Contract directly

// 📌 Register a new user
app.post('/register', async (req, res) => {
  try {
    const { userAddress } = req.body;
    const tx = await contract.registerUser(userAddress);
    await tx.wait();
    res.json({ success: true, message: "User registered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🏷️ Issue a certificate
app.post('/issue', async (req, res) => {
  try {
    const { userAddress, certHash } = req.body;
    const tx = await contract.issueCertificate(userAddress, certHash);
    await tx.wait();
    res.json({ success: true, message: "Certificate issued" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Verify certificate
app.post('/verify', async (req, res) => {
  try {
    const { userAddress, uploadedHash } = req.body;
    const isValid = await contract.verifyCertificate(userAddress, uploadedHash);
    res.json({ isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("✅ API running on http://localhost:3001");
});
