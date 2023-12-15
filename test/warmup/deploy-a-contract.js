const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves DeployChallenge", async function () {
  const contract = await buildContract("DeployChallenge");
  
  expect(await contract.isComplete()).to.equal(true);
});
