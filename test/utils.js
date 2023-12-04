const { ethers } = require("hardhat");

async function fixtureFactory(contractName, value=0) {
  const [owner, attacker] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy({value: value});

  return { contract, owner, attacker };
}

module.exports = {
  fixtureFactory,
};
