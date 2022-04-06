// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SheraV2 is ERC20 {
    constructor() ERC20("Shera", "SHR") {
        _mint(msg.sender, 2000000000 * 10 ** decimals());
    }

}