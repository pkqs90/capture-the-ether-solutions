const { setBalance } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

it("Solves AccountTakeoverChallenge", async function () {
  const [signer] = await ethers.getSigners();
  const contract = await buildContract("AccountTakeoverChallenge");
  const address = signer.getAddress();

  // One can recover the private key due to ECDSA `k` collision.
  // https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm
  // https://bitcoin.stackexchange.com/questions/35848/recovering-private-key-when-someone-uses-the-same-k-twice-in-ecdsa-signatures

  const wallet = new ethers.Wallet("0x614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269", ethers.provider);
  await setBalance(wallet.address, ethers.parseEther("0.1"));

  await contract.connect(wallet).authenticate();
  expect(await contract.isComplete()).to.equal(true);
});
