const { ethers } = require("hardhat");

async function fixtureFactory(contractName) {
  const [owner, attacker] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy();

  return { contract, owner, attacker };
}

module.exports = {
  fixtureFactory,
};
