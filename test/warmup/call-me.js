const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves CallMeChallenge", async function () {
  const contract = await buildContract("CallMeChallenge");
  
  await contract.callme();
  expect(await contract.isComplete()).to.equal(true);
});
