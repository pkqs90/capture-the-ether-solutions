require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.4.22" },
      { version: "0.8.19" },
    ],
  },
  // defaultNetwork: "localhost",
};
