const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");

it("Solves Challenge", async function () {
  const fixture = () => fixtureFactory("CallMeChallenge");
  const { contract } = await loadFixture(fixture);
  await contract.callme();
  expect(await contract.isComplete()).to.equal(true);
});
