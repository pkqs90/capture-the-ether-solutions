const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

it("Solves RetirementFundChallenge", async function () {
  const [, attacker] = await ethers.getSigners();
  const contract = await buildContract("RetirementFundChallenge", ethers.parseEther("1.0"), attacker);
  
  const address = await contract.getAddress();
  await buildContract("RetirementFundChallengeAttacker", ethers.parseEther("0.001"), address);

  // Switch to attacker context.
  const contractConnectedToAttacker = contract.connect(attacker);
  await contractConnectedToAttacker.collectPenalty();

  expect(await contract.isComplete()).to.equal(true);
});
