pragma solidity ^0.4.21;

contract CaptureTheEther {
    mapping (address => bytes32) public nicknameOf;
    mapping (address => address) public challengeAddressOf;

    function deployNicknameChallenge() public {
        NicknameChallenge challenge = new NicknameChallenge(msg.sender);
        challengeAddressOf[msg.sender] = challenge;
    }

    function setNickname(bytes32 nickname) public {
        nicknameOf[msg.sender] = nickname;
    }
}

contract NicknameChallenge {
    CaptureTheEther cte = CaptureTheEther(msg.sender);
    address player;

    // Your address gets passed in as a constructor parameter.
    function NicknameChallenge(address _player) public {
        player = _player;
    }

    // Check that the first character is not null.
    function isComplete() public view returns (bool) {
        return cte.nicknameOf(player)[0] != 0;
    }
}
