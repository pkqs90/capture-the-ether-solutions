const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

async function fixture() {
  // Contracts are deployed using the first signer/account by default
  const [owner, attacker] = await ethers.getSigners();

  const DeployChallenge = await ethers.getContractFactory("DeployChallenge");
  const contract = await DeployChallenge.deploy(DeployChallenge);

  return { contract, owner, attacker };
}

it("Solves Challenge", async function () {
  const { contract } = await loadFixture(fixture);
  expect(await contract.isComplete()).to.equal(true);
});
