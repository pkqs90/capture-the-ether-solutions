const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves GuessTheNewNumberChallenge", async function () {
  const contract = await buildContract("GuessTheNewNumberChallenge", ethers.parseEther("1.0"));
  const attackerContract = await buildContract("GuessTheNewNumberChallengeAttacker");

  await attackerContract.attack(await contract.getAddress(), {
    value: ethers.parseEther("1.0")
  });
  expect(await contract.isComplete()).to.equal(true);
  expect(await contract.runner.provider.getBalance(await attackerContract.getAddress())).to.equal(ethers.parseEther("2.0"));
  await attackerContract.withdraw();
  expect(await contract.runner.provider.getBalance(await attackerContract.getAddress())).to.equal(ethers.parseEther("0.0"));
});
