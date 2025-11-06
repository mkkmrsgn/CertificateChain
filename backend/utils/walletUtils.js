const { Wallet } = require("ethers");
const crypto = require("crypto");

function createWallet() {
  const wallet = Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

function hashBiometricData(facialData, fingerprintData) {
  const combined = facialData + fingerprintData;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

module.exports = {
  createWallet,
  hashBiometricData,
};
