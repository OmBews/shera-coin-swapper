// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Shera is ERC20 {
    address public owner;
    constructor() ERC20("Shera", "SHR") {
        owner = msg.sender;
        _mint(msg.sender, 2000000000 * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return 9;
    }

    function faucet(address _sender) external {
        ERC20(address(this)).transferFrom(owner, _sender, 10 ** decimals());
    }
}