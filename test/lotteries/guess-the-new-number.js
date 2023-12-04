const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");

it("Solves GuessTheNewNumberChallenge", async function () {
  const fixture = () => fixtureFactory("GuessTheNewNumberChallenge", ethers.parseEther("1.0"));
  const contract = await loadFixture(fixture);

  const attacterFixture = () => fixtureFactory("GuessTheNewNumberChallengeAttacker");
  const attackerContract = await loadFixture(attacterFixture);

  await attackerContract.attack(await contract.getAddress(), {
    value: ethers.parseEther("1.0")
  });
  expect(await contract.isComplete()).to.equal(true);
  expect(await contract.runner.provider.getBalance(await attackerContract.getAddress())).to.equal(ethers.parseEther("2.0"));
  await attackerContract.withdraw();
  expect(await contract.runner.provider.getBalance(await attackerContract.getAddress())).to.equal(ethers.parseEther("0.0"));
});
