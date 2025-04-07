pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockMON is ERC20 {
    constructor() ERC20("MockMON", "MON") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
