// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {StakeWars} from "../src/Stakewars.sol";
import {MockMON} from "../src/mock/MockMON.sol";

contract StakeWarsTest is Test {
    StakeWars public stakeWars;
    MockMON public monToken;
    
    address public admin;
    address public player1;
    address public player2;
    uint256 public constant INITIAL_BALANCE = 1000 ether;
    uint256 public constant STAKE_AMOUNT = 100 ether;
    string public constant GAME_ID = "game1";

    event GamePotCreated(string indexed gameId, uint256 initialAmount);
    event WinnerAssigned(string indexed gameId, address indexed winner);
    event PotClaimed(string indexed gameId, address indexed winner, uint256 amount);
    event JoinGamePot(address indexed staker, uint256 amount, uint256 newTotal);
    event StakeWithdrawn(address indexed staker, uint256 amount, uint256 remainingStake);

    function setUp() public {
        admin = makeAddr("admin");
        player1 = makeAddr("player1");
        player2 = makeAddr("player2");

        vm.startPrank(admin);
        monToken = new MockMON();
        stakeWars = new StakeWars(address(monToken));
        vm.stopPrank();

        // Setup initial balances
        deal(address(monToken), player1, INITIAL_BALANCE);
        deal(address(monToken), player2, INITIAL_BALANCE);

        // Approve stakeWars contract to spend tokens
        vm.prank(player1);
        monToken.approve(address(stakeWars), type(uint256).max);
        vm.prank(player2);
        monToken.approve(address(stakeWars), type(uint256).max);
    }

    function test_CreatePot() public {
        vm.prank(player1);
        
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);

        (, address staker1, address staker2, address winner, uint256 potAmount, string memory gameId) = 
            stakeWars.gameIdToGamePot(GAME_ID);

        assertEq(staker1, player1);
        assertEq(staker2, address(0));
        assertEq(winner, address(0));
        assertEq(potAmount, STAKE_AMOUNT);
        assertEq(gameId, GAME_ID);
    }

    function test_JoinPot() public {
        // First create a pot
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);

        vm.prank(player2);

        
        stakeWars.joinPot(GAME_ID);

        (,, address staker2,, uint256 potAmount,) = stakeWars.gameIdToGamePot(GAME_ID);
        assertEq(staker2, player2);
        assertEq(potAmount, STAKE_AMOUNT * 2);
    }

    function test_AssignWinner() public {
        // Setup game with two players
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);
        vm.prank(player2);
        stakeWars.joinPot(GAME_ID);

        vm.prank(admin);

        
        stakeWars.assignWinner(GAME_ID, player1);

        (,,, address winner,,) = stakeWars.gameIdToGamePot(GAME_ID);
        assertEq(winner, player1);
    }

    function test_ClaimPot() public {
        // Setup complete game scenario
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);
        vm.prank(player2);
        stakeWars.joinPot(GAME_ID);
        vm.prank(admin);
        stakeWars.assignWinner(GAME_ID, player1);

        uint256 balanceBefore = monToken.balanceOf(player1);
        
        vm.prank(player1);
        
        stakeWars.claimPot(GAME_ID);

        uint256 balanceAfter = monToken.balanceOf(player1);
        assertEq(balanceAfter - balanceBefore, STAKE_AMOUNT * 2);
    }

    function test_WithdrawFunds() public {
        // Create pot but don't join
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);

        uint256 balanceBefore = monToken.balanceOf(player1);
        
        vm.prank(player1);
        
        stakeWars.withdrawFunds(GAME_ID);

        uint256 balanceAfter = monToken.balanceOf(player1);
        assertEq(balanceAfter - balanceBefore, STAKE_AMOUNT);
    }

    function test_Revert_JoinOwnGame() public {
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);

        vm.prank(player1);
        vm.expectRevert("You cannot join your own game");
        stakeWars.joinPot(GAME_ID);
    }

    function test_Revert_JoinFullGame() public {
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);
        
        vm.prank(player2);
        stakeWars.joinPot(GAME_ID);

        address player3 = makeAddr("player3");
        vm.prank(player3);
        vm.expectRevert("Game already has two players");
        stakeWars.joinPot(GAME_ID);
    }

    function test_Revert_ClaimWithoutWinner() public {
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);
        
        vm.prank(player2);
        stakeWars.joinPot(GAME_ID);

        vm.prank(player1);
        vm.expectRevert("Not winner to claim the pot");
        stakeWars.claimPot(GAME_ID);
    }

    function test_Revert_WithdrawWithTwoPlayers() public {
        vm.prank(player1);
        stakeWars.createPot(GAME_ID, STAKE_AMOUNT);
        
        vm.prank(player2);
        stakeWars.joinPot(GAME_ID);

        vm.prank(player1);
        vm.expectRevert("Game already has two players");
        stakeWars.withdrawFunds(GAME_ID);
    }

    function test_AdminFunctions() public {
        address newAdmin = makeAddr("newAdmin");
        
        vm.prank(admin);
        stakeWars.setAdmin(newAdmin);
        assertEq(stakeWars.admin(), newAdmin);

        // Test withdrawStuckTokens
        deal(address(monToken), address(stakeWars), STAKE_AMOUNT);
        vm.prank(newAdmin);
        stakeWars.withdrawStuckTokens(address(monToken));
        assertEq(monToken.balanceOf(newAdmin), STAKE_AMOUNT);
    }
}