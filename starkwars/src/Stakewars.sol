// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
import "./interfaces/IERC20.sol";

contract StakeWars {
    struct GamePot {
        uint256 pos;
        address staker1;
        address staker2;
        address winner;
        uint256 potAmount;
        string gameId;
    }

    GamePot[] public gamePots;
    uint256 public numberOfGamePots;
    mapping(string => GamePot) public gameIdToGamePot;
    IERC20 public monToken;
    address public admin;

    event GamePotCreated(string indexed gameId, uint256 initialAmount);
    event WinnerAssigned(string indexed gameId, address indexed winner);
    event PotClaimed(string indexed gameId, address indexed winner, uint256 amount);
    event JoinGamePot(address indexed staker, uint256 amount, uint256 newTotal);
    event StakeWithdrawn(address indexed staker, uint256 amount, uint256 remainingStake);

    constructor(address token) payable {
        monToken = IERC20(token);
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this contract.");
        _;
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function createPot(string memory gameId, uint256 stakeAmount) external payable {
        address currentPlayer = msg.sender;
        require(stakeAmount > 0, "Please select a stake amount");
        numberOfGamePots = numberOfGamePots++;
        GamePot memory gamePot = GamePot(numberOfGamePots, currentPlayer, address(0), address(0), stakeAmount, gameId);
        if (gameIdToGamePot[gameId].staker1 == address(0)) {
            gameIdToGamePot[gameId] = gamePot;

            gamePots.push(gamePot);
            monToken.transferFrom(currentPlayer, address(this), stakeAmount);
        } else {
            revert("Game pot already exist for this gameId");
        }
        emit GamePotCreated(gameId, stakeAmount);
    }

    function joinPot(string memory gameId) external payable {
        address currentPlayer = msg.sender;
        require(gameIdToGamePot[gameId].staker1 != address(0), "Game does not exist");
        require(gameIdToGamePot[gameId].staker2 == address(0), "Game already has two players");
        require(gameIdToGamePot[gameId].staker1 != currentPlayer, "You cannot join your own game");
        uint256 len = gamePots.length;
        GamePot memory gamePot = gameIdToGamePot[gameId];
        uint256 stakeAmount = gamePot.potAmount;
        // update the game pot in the gamePots array
        for (uint256 i = 0; i < len; i++) {
            if (_compareStrings(gamePots[i].gameId, gameId)) {
                gamePots[i].staker2 = currentPlayer;
                gamePots[i].potAmount = gamePots[i].potAmount + stakeAmount;
                gameIdToGamePot[gameId] = gamePots[i];
            }
        }
        monToken.transferFrom(currentPlayer, address(this), stakeAmount);
        emit JoinGamePot(currentPlayer, stakeAmount, gameIdToGamePot[gameId].potAmount);
    }

    function assignWinner(string memory gameId, address winner) external onlyAdmin {
        require(gameIdToGamePot[gameId].staker1 != address(0), "Game does not exist");
        require(gameIdToGamePot[gameId].staker2 != address(0), "Game does not have two players");
        require(gameIdToGamePot[gameId].winner == address(0), "Game already has a winner");
        require(winner != address(0), "No Winner");
        uint256 len = gamePots.length;
        for (uint256 i = 0; i < len; i++) {
            if (_compareStrings(gamePots[i].gameId, gameId)) {
                gamePots[i].winner = winner;
                gameIdToGamePot[gameId] = gamePots[i];
            }
        }
        emit WinnerAssigned(gameId, winner);
    }

    function claimPot(string calldata gameId) external {
        require(gameIdToGamePot[gameId].winner == msg.sender, "Not winner to claim the pot");
        require(gameIdToGamePot[gameId].potAmount > 0, "No pot to claim");

        uint256 potAmount = gameIdToGamePot[gameId].potAmount;
        uint256 len = gamePots.length;
        for (uint256 i = 0; i < len; i++) {
            if (_compareStrings(gamePots[i].gameId, gameId)) {
                gamePots[i].potAmount = 0;
                gameIdToGamePot[gameId] = gamePots[i];
            }
        }
        // Clear pot amount first
        monToken.transfer(msg.sender, potAmount);
        emit PotClaimed(gameId, msg.sender, potAmount);
    }

    function withdrawFunds(string memory gameId) external {
        require(gameIdToGamePot[gameId].staker1 == msg.sender, "Not winner to claim the pot");
        require(gameIdToGamePot[gameId].staker2 == address(0), "Game already has two players");

        uint256 len = gamePots.length;
        GamePot memory gamePot = gameIdToGamePot[gameId];
        uint256 potAmount = gamePot.potAmount;
        for (uint256 i = 0; i < len; i++) {
            if (_compareStrings(gamePots[i].gameId, gameId)) {
                gamePots[i].staker1 = address(0);
                gamePots[i].potAmount = 0;
                gameIdToGamePot[gameId] = gamePots[i];
            }
        }
        monToken.transfer(msg.sender, potAmount);
        emit StakeWithdrawn(msg.sender, potAmount, 0);
    }

    function withdrawStuckTokens(address tokenAddress) external onlyAdmin {
        IERC20(tokenAddress).transfer(admin, IERC20(tokenAddress).balanceOf(address(this)));
    }

    // Helper function to compare strings
    function _compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
