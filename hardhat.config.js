require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.24" }, // your other contracts
      { version: "0.8.28" }  // matches Lock.sol
    ]
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
    // sepolia can be added later
  }
};
