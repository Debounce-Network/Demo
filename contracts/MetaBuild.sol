// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";


/* MetaBuild Contract
 * For convenience, the demo contract and data contract are managed in one file.
 */

contract MetaBuild is Ownable {
    // All state variables are used only within the debounce chain.
    mapping(address => bool) private _whitelist;
    mapping(address => mapping(uint => string)) public messages;
    mapping(address => uint) public offsets;

    modifier onlyWhitelisted {
        require(_whitelist[msg.sender], "!whitelist");
        _;
    }

    event Sent(address indexed account, string message);
    event Clear(address indexed account);

    /** Views (in debounce chain) **/

    function read(address account, uint offset) public view returns (string memory) {
        return messages[account][offset];
    }

    /** Interactions (Used only in service chains [Aurora, Aurora Testnet, Polygon]) **/

    function sendMsg(string calldata message) external {
        require(bytes(message).length > 0, '!message');
        if (keccak256(abi.encodePacked('clear')) == keccak256(abi.encodePacked(message))) emit Clear(msg.sender);
        else emit Sent(msg.sender, message);
    }

    /** Restricted **/

    function setWhitelist(address target, bool on) external onlyOwner {
        require(target != address(0), "!target");
        _whitelist[target] = on;
    }

    function write(address account, string calldata data) external onlyWhitelisted {
        messages[account][offsets[account]] = data;
        offsets[account] += 1;
    }

    function clear(address account) external onlyWhitelisted {
        offsets[account] = 0;
    }
}
