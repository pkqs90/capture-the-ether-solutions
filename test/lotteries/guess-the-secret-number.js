const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");
const assert = require('node:assert').strict;

it("Solves Challenge", async function () {
  const fixture = () => fixtureFactory("GuessTheSecretNumberChallenge", ethers.parseEther("1.0"));
  const { contract } = await loadFixture(fixture);

  const expectedHash = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";
  let x = -1;
  for (let i = 0; i < 256; ++i) {
    const hash = ethers.solidityPackedKeccak256(["uint8"], [i]);
    if (hash === expectedHash) {
      x = i;
      break;
    }
  }

  assert(x != -1);
  // Secret number: 170
  console.log("Secret number:", x);

  await contract.guess(x, {
    value: ethers.parseEther("1.0"),
  });
  expect(await contract.isComplete()).to.equal(true);
});
