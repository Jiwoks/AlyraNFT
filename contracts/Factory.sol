// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICollectionMaster.sol";
import "./Collection.sol";

contract Factory is Ownable {

    address private master;
    uint256 private collectionCreatedCount;

    event CollectionCreated(string name, address collectionAddress, uint timestamp);

    constructor(address _master) {
        master = _master;
    }

    function createCollection(string memory _name, string memory _symbol, string memory _description) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(Collection).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(_name, block.timestamp, collectionCreatedCount));

        assembly {
            collectionAddress := create2(0, add(collectionBytecode, 0x20), mload(collectionBytecode), salt)
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }

        // Initialize the collection contract
        Collection(collectionAddress).init(msg.sender, _name, _symbol, _description);

        // Save the owner of this collection in master contract
        ICollectionMaster(master).createCollection(msg.sender, collectionAddress);

        collectionCreatedCount ++;

        emit CollectionCreated(_name, collectionAddress, block.timestamp);

        return collectionAddress;
    }
}
