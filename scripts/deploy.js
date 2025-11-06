const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CertificateIssuer...");

  // Get the contract factory
  const CertificateIssuer = await hre.ethers.getContractFactory("CertificateIssuer");

  // Deploy the contract
  const contract = await CertificateIssuer.deploy();

  // Wait for deployment
  await contract.waitForDeployment(); // ✅ updated function

  // Get deployed address
  const address = await contract.getAddress(); // ✅ new ethers v6 method

  console.log(`✅ CertificateIssuer deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
