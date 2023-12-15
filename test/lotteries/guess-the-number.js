const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves GuessTheNumberChallenge", async function () {
  const contract = await buildContract("GuessTheNumberChallenge", ethers.parseEther("1.0"));
  
  await contract.guess(42, {
    value: ethers.parseEther("1.0"),
  });
  expect(await contract.isComplete()).to.equal(true);
});
