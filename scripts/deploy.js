
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // How long you want to lock the ether, here we set 60s after your deployment


  const Soulbound = await ethers.deployContract("Soulbound");

  await Soulbound.waitForDeployment();

  const reputation = await ethers.deployContract("Reputation",[Soulbound.target]);

  await reputation.waitForDeployment();

  console.log(
    `Deployed to ${Soulbound.target} and 
    reputation contract is deployed to ${reputation.target}`
  );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});