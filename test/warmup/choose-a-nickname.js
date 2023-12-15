const { expect } = require("chai");

async function deploy() {
  const [owner] = await ethers.getSigners();

  const cteFactory = await ethers.getContractFactory("CaptureTheEther");
  const ncFactory = await ethers.getContractFactory("NicknameChallenge");
  
  // Deploy CaptureTheEther contract.
  const cteContract = await cteFactory.deploy();

  // Use it to deploy NicknameChallenge contract for `owner`.
  await cteContract.deployNicknameChallenge();
  const challengeAddress = await cteContract.challengeAddressOf(owner);

  // Attach to deployed NicknameChallenge contract.
  const ncContract = ncFactory.attach(challengeAddress);

  return { cteContract, ncContract };
}

it("Solves NicknameChallenge", async function () {
  const { cteContract, ncContract } = await deploy();
  const nickname = ethers.encodeBytes32String("random nickname");
  await cteContract.setNickname(nickname);
  expect(await ncContract.isComplete()).to.equal(true);
});
