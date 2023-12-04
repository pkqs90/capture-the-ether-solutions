const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");
const assert = require('node:assert').strict;

it("Solves AssumeOwnershipChallenge", async function () {
  const [, attacker] = await ethers.getSigners();
  const fixture = () => fixtureFactory("AssumeOwnershipChallenge");
  const contract = await loadFixture(fixture);

  const contractConnectedToAttacker = contract.connect(attacker);
  await contractConnectedToAttacker.AssumeOwmershipChallenge();
  await contractConnectedToAttacker.authenticate();

  expect(await contract.isComplete()).to.equal(true);
});
