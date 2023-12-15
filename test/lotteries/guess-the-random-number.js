const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

async function calculateHash(contract) {
    // Get the latest block
    const blockNumber = await contract.runner.provider.getBlockNumber();
    const block = await contract.runner.provider.getBlock(blockNumber);

    const previousBlockHash = block.parentHash;
    const timestamp = block.timestamp;

    // Calculate the keccak256 hash
    const hash = ethers.solidityPackedKeccak256(
        ["bytes32", "uint256"], 
        [previousBlockHash, timestamp]
    );

    // Convert the last byte of the hash to an integer (uint8).
    const result = parseInt(hash.slice(-2), 16);
    return result;
}

it("Solves GuessTheRandomNumberChallenge", async function () {
  const contract = await buildContract("GuessTheRandomNumberChallenge", ethers.parseEther("1.0"));

  // Use 2 different ways to lookup the random number.
  //   1. Calculate it using the same formula as the smart contract, since blockhash and timestamp is accessible.
  //      However, recall that EVM only provides access to most recent 256 blocks. If access is needed for older
  //      blocks, an archive node or blockchain explorers would be needed.
  //   2. Simply lookup the storage data in slot 0.
  const ans0 = await calculateHash(contract);
  const ans1 = parseInt(await contract.runner.provider.getStorage(await contract.getAddress(), 0));
  assert(ans0 === ans1);
  console.log("Random number:", ans0);

  await contract.guess(ans0, {
    value: ethers.parseEther("1.0"),
  });
  expect(await contract.isComplete()).to.equal(true);
});
