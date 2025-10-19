// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LeaderboardGymFun is ReentrancyGuard {
    uint256 public signFee;
    uint256 public constant MAX_SCORE = 1_000_000;
    uint256 public constant TOP_SIZE = 10;

    mapping(address => uint256) public scores;
    mapping(address => uint256) public lastScoreUpdate;

    address public owner;

    address[TOP_SIZE] public leaderboardAddresses;
    uint256[TOP_SIZE] public leaderboardScores;

    event ScoreSubmitted(address indexed user, uint256 score);
    event LeaderboardUpdated(address indexed user, uint256 score, uint256 position);
    event FeeChanged(uint256 newFee);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(uint256 _signFee) {
        signFee = _signFee;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function setSignFee(uint256 _newFee) external onlyOwner {
        signFee = _newFee;
        emit FeeChanged(_newFee);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    function submitScore(uint256 _score) external payable nonReentrant {
        require(msg.value >= signFee, "Not enough ETH to pay signFee");
        require(_score > 0 && _score <= MAX_SCORE, "Score must be between 1 and 1,000,000");
        require(
            lastScoreUpdate[msg.sender] == 0 ||
            block.timestamp - lastScoreUpdate[msg.sender] >= 24 hours,
            "You can only submit a score once every 24 hours"
        );

        if (_score <= scores[msg.sender]) {
            // Do nothing if score not improved
            return;
        }

        scores[msg.sender] = _score;
        lastScoreUpdate[msg.sender] = block.timestamp;

        _updateLeaderboard(msg.sender, _score);

        emit ScoreSubmitted(msg.sender, _score);

        // Refund excess ETH
        uint256 excess = msg.value - signFee;
        if (excess > 0) payable(msg.sender).transfer(excess);
    }

    function _updateLeaderboard(address user, uint256 score) internal {
        uint256 position = TOP_SIZE;
        for (uint256 i = 0; i < TOP_SIZE; i++) {
            if (score > leaderboardScores[i]) {
                position = i;
                break;
            }
        }

        if (position == TOP_SIZE) return;

        for (uint256 j = TOP_SIZE - 1; j > position; j--) {
            leaderboardScores[j] = leaderboardScores[j - 1];
            leaderboardAddresses[j] = leaderboardAddresses[j - 1];
        }

        leaderboardScores[position] = score;
        leaderboardAddresses[position] = user;

        emit LeaderboardUpdated(user, score, position);
    }

    function getLeaderboard() external view returns (address[TOP_SIZE] memory, uint256[TOP_SIZE] memory) {
        return (leaderboardAddresses, leaderboardScores);
    }

    function withdraw(address payable _to) external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        _to.transfer(balance);
        emit Withdrawn(_to, balance);
    }

    receive() external payable {}
}
