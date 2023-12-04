const { ethers } = require("hardhat");

async function fixtureFactory(contractName, value=0, ...args) {
  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy(...args, {value: value});
  return contract;
}

module.exports = {
  fixtureFactory,
};
