import { ethers } from 'hardhat';

async function main() {
  // Deploying the EthVault contract
  const ethVault = await ethers.deployContract('EthVault');

  // Wait until the contract is fully deployed
  await ethVault.waitForDeployment();

  // Print the deployed contract address
  console.log('EthVault Contract Deployed at: ', ethVault.target);
}

// Handle errors and ensure process exit codes are set properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
