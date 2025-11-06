const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const CertificateIssuer = await hre.ethers.getContractFactory("CertificateIssuer");

  // Deploy the contract
  const contract = await CertificateIssuer.deploy();

  // Wait for deployment to finish
  await contract.waitForDeployment(); // ✅ Use this instead of contract.deployed()

  // Get deployed address
  const address = await contract.getAddress(); // ✅ Use getAddress()

  console.log(`✅ CertificateIssuer deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
