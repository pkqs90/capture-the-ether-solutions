const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

it("Solves AssumeOwnershipChallenge", async function () {
  const [, attacker] = await ethers.getSigners();
  const contract = await buildContract("AssumeOwnershipChallenge");  

  const contractConnectedToAttacker = contract.connect(attacker);
  await contractConnectedToAttacker.AssumeOwmershipChallenge();
  await contractConnectedToAttacker.authenticate();

  expect(await contract.isComplete()).to.equal(true);
});
