/* SPDX-License-Identifier: MIT
    One way swapper from Sheera v1 to Sheera v2
    NEVER SEND Sheera v1 DIRECTLY TO THIS CONTRACT
    Only migrate your Sheera v1 using swap.sheratokens.com
    SheeraV1:  Decimals: 9
    SheeraV2:  Decimals: 9
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SheeraSwapper is Ownable {
    using SafeMath for uint256;

    ERC20 private _sheera_old;
    ERC20 private _sheera_new;
    constructor(address sheera_old, address sheera_new, address owner) {
        _sheera_old = ERC20(sheera_old);
        _sheera_new = ERC20(sheera_new);
        require(_sheera_old.decimals() == 9, "SheeraSwapper: invalid address of Shera V1");
        require(_sheera_new.decimals() == 9, "SheeraSwapper: invalid address of Shera V2");
        transferOwnership(owner);
    }

    function doSwap() public {
        address sender = _msgSender();
        uint256 balance = _sheera_old.balanceOf(sender);
        require(balance >= (10 ** 6), "SheeraSwapper: caller doesn't hold valid amount of Shera token");
        require(_sheera_old.transferFrom(sender, address(this), balance), "SheeraSwapper: failed transferFrom");
        require(_sheera_new.transferFrom(owner(), sender, getNewTokenAmount(balance)), "SheeraSwapper: failed transfer");

    }

    function getNewTokenAmount(uint weiAmount) internal pure returns (uint256) {
        return weiAmount.mul(1).div(10 ** 6);
    }

    function setOldSheraContract(address sheera_old) public onlyOwner {
        _sheera_old = ERC20(sheera_old);
    } 

    function setNewSheraContract(address sheera_new) public onlyOwner {
        _sheera_new = ERC20(sheera_new);
    } 

    function get_sheera_v1() public view returns(ERC20) {
        return _sheera_old;
    }

    function get_sheera_v2() public view returns(ERC20) {
        return _sheera_new;
    }

   function withdraw() external onlyOwner {
        uint balance = _sheera_old.balanceOf(address(this));
        require(balance > 0, "No token left to withdraw");

       _sheera_old.transfer(msg.sender, balance);
    }


    /* Accept ETH deposits */
    receive() external payable {}
    fallback() external payable {}
}
