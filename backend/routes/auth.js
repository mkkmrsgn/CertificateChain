const express = require("express");
const fs = require("fs");
const router = express.Router();
const { createWallet, hashBiometricData } = require("../utils/walletUtils");

const usersFile = "./users.json";

// 🔐 Register
router.post("/register", (req, res) => {
  const { name, email, facialData, fingerprintData } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const biometricHash = hashBiometricData(facialData, fingerprintData);
  const { address, privateKey } = createWallet();

  let users = JSON.parse(fs.readFileSync(usersFile));
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const newUser = { name, email, biometricHash, address, privateKey };
  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({ success: true, address });
});
// 🔐 Login
router.post("/login", (req, res) => {
  const { name, facialData, fingerprintData } = req.body;
  const biometricHash = hashBiometricData(facialData, fingerprintData);

  const users = JSON.parse(fs.readFileSync(usersFile));
  const user = users.find(
    u => u.name === name && u.biometricHash === biometricHash
  );

  if (!user) return res.status(401).json({ error: "Invalid credentials." });

  res.json({ success: true, address: user.address });
});

module.exports = router;
