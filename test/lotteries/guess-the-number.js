const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");

it("Solves GuessTheNumberChallenge", async function () {
  const fixture = () => fixtureFactory("GuessTheNumberChallenge", ethers.parseEther("1.0"));
  const contract = await loadFixture(fixture);
  await contract.guess(42, {
    value: ethers.parseEther("1.0"),
  });
  expect(await contract.isComplete()).to.equal(true);
});
