const User = require('../models/User');
const { Wallet } = require('ethers');

exports.registerUser = async (req, res) => {
  try {
    const { name, facialData, fingerprintHash } = req.body;

    const wallet = Wallet.createRandom(); // Generates private/public key

    const user = new User({
      name,
      facialData,
      fingerprintHash,
      wallet: {
        address: wallet.address,
        privateKey: wallet.privateKey // Consider encrypting this!
      }
    });

    await user.save();
    res.json({ success: true, walletAddress: wallet.address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { name, facialData, fingerprintHash } = req.body;

    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ error: "User not found" });

    // TODO: Compare facialData & fingerprintHash (simplified match for now)
    if (user.fingerprintHash !== fingerprintHash) {
      return res.status(401).json({ error: "Biometric mismatch" });
    }

    res.json({ success: true, walletAddress: user.wallet.address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
