/* SPDX-License-Identifier: MIT
    One way swapper from Sheera v1 to Sheera v2
    NEVER SEND Sheera v1 DIRECTLY TO THIS CONTRACT
    Only migrate your Sheera v1 using swap.sheratokens.com
    SheeraV1: 0x5FbDB2315678afecb367f032d93F642f64180aa3 Decimals: 9
    SheeraV2: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 Decimals: 18
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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

    function setOldSheraContract(address _sheraV1) public onlyOwner {
        _sheera_v1 = ERC20(_sheraV1);
    } 

    function setNewSheraContract(address _sheraV2) public onlyOwner {
        _sheera_v2 = ERC20(_sheraV2);
    } 



    /* Accept ETH deposits */
    receive() external payable {}
    fallback() external payable {}
}