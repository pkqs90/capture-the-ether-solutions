const { expect } = require("chai");
const { buildContract } = require("../utils");
const assert = require('node:assert').strict;

function calculatePublicKey(tx) {
  // Since Hardhat uses eip1559 by default, we should pass in `maxPriorityFeePerGas` and `maxFeePerGas` instead of legacy `gasPrice`.
  const txData = {
    gasLimit: tx.gasLimit,
    value: tx.value,
    nonce: tx.nonce,
    data: tx.data,
    to: tx.to,
    chainId: tx.chainId,
    maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
    maxFeePerGas: tx.maxFeePerGas,
  };
  const newTx = ethers.Transaction.from(txData);
  const newTxSerialized = newTx.unsignedSerialized;
  const newTxHash = ethers.keccak256(newTxSerialized);
  const pk = ethers.SigningKey.recoverPublicKey(newTxHash, tx.signature);
  return pk;
}

it("Solves GuessTheNewNumberChallenge", async function () {
  const [signer] = await ethers.getSigners();
  const contract = await buildContract("PublicKeyChallenge");  
  const address = signer.getAddress();

  // Dummy transaction.
  const txResponse = await signer.sendTransaction({
      to: address
  });

  // This is the private key of signer, which deployed challenge `PublicKeyChallenge`. We can use 
  // the deployment tx to calculate its public key.
  // Public key:            0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5
  // Compressed public key: 0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75
  // Address =              0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  const signingKey = new ethers.SigningKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  const publicKey = signingKey.publicKey;

  // Calculate pk by txResponse data.
  const pk = calculatePublicKey(txResponse);

  assert(publicKey === pk);
  // Since the public keys are uncompressed, they contain a `04` prefix which should be thrown away.
  const rawPk = `0x${publicKey.slice(4)}`;
  await contract.authenticate(rawPk);
  expect(await contract.isComplete()).to.equal(true);
});
