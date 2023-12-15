const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves PredictTheFutureChallenge", async function () {
  const contract = await buildContract("PredictTheFutureChallenge", ethers.parseEther("1.0"));
  const address = await contract.getAddress();
  const attackerContract = await buildContract("PredictTheFutureChallengeAttacker", 0, address);

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
