const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");
const assert = require('node:assert').strict;

it("Solves RetirementFundChallenge", async function () {
  const [, attacker] = await ethers.getSigners();
  const fixture = () => fixtureFactory("RetirementFundChallenge", ethers.parseEther("1.0"), attacker);
  const contract = await loadFixture(fixture);

  const address = await contract.getAddress();
  const attackerFixture = () => fixtureFactory("RetirementFundChallengeAttacker", ethers.parseEther("0.001"), address);
  await loadFixture(attackerFixture);

  // Switch to attacker context.
  const contractConnectedToAttacker = contract.connect(attacker);
  await contractConnectedToAttacker.collectPenalty();

  expect(await contract.isComplete()).to.equal(true);
});
