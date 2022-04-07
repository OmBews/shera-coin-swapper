// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

contract SheraV2 is ERC20 {
    constructor() ERC20("Shera", "SHR") {
        _mint(msg.sender, 2000000000 * 10 ** decimals());
    }

}

contract SheeraSwapper is Ownable {
    ERC20 private _sheera_v1;
    ERC20 private _sheera_v2;
    constructor(address sheera_v1, address sheera_v2, address owner) {
        _sheera_v1 = ERC20(sheera_v1);
        _sheera_v2 = ERC20(sheera_v2);
        require(_sheera_v1.decimals() == 9, "SheeraSwapper: invalid address of Shera V1");
        require(_sheera_v2.decimals() == 18, "SheeraSwapper: invalid address of Shera V2");
        transferOwnership(owner);
    }

    function doSwap() public {
        address sender = _msgSender();
        uint256 balance = _sheera_v1.balanceOf(sender);
        require(balance > 0, "SheeraSwapper: caller doesn't hold STCV1");
        require(_sheera_v1.transferFrom(sender, address(this), balance), "SheeraSwapper: failed transferFrom");
        require(_sheera_v2.transferFrom(owner(), sender, balance*(10**9)), "SheeraSwapper: failed transfer");

    }



    /* Accept ETH deposits */
    receive() external payable {}
    fallback() external payable {}
}