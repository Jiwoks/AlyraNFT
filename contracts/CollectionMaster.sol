// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol";

contract CollectionMaster is Ownable {

    mapping(address => address[]) public userCollections;

    mapping(address => mapping(uint256 => uint256)) public itemPrice;

    mapping(address => uint256) public userBalance;

    modifier onlyApproved(address _collectionAddress, uint256 _itemId) {
        require(
            Collection(_collectionAddress).getApproved(_itemId) == address(this) ||
            Collection(_collectionAddress).isApprovedForAll(Collection(_collectionAddress).ownerOf(_itemId), address(this)),
            "Approval required"
        );
    _;
    }

    event CollectionCreated(address collectionOwnerAddress, address collectionAddress);

    event ItemPriceChanged(address collectionAddress, uint256 tokenId, uint256 priceBefore, uint256 priceAfter);

    event Bought(address previousOwner, address newOwner, uint256 price);

    function createCollection(address _collectionOwnerAddress, address _collectionAddress) external onlyOwner {
        userCollections[_collectionOwnerAddress].push(_collectionAddress);
        emit CollectionCreated(_collectionOwnerAddress, _collectionAddress);
    }

    function setItemPrice(address _collectionAddress, uint256 _itemId, uint256 _price) external onlyApproved(_collectionAddress, _itemId) {
        // Only the owner can sell the token
        require(Collection(_collectionAddress).ownerOf(_itemId) == msg.sender, "You're not the owner");

        emit ItemPriceChanged(_collectionAddress, _itemId, itemPrice[_collectionAddress][_itemId], _price);

        // Save price
        itemPrice[_collectionAddress][_itemId] = _price;

    }

    function buy(address _collectionAddress, uint256 _itemId) external onlyApproved(_collectionAddress, _itemId) payable {
        // Make sure right amount of ether sent
        require(msg.value == itemPrice[_collectionAddress][_itemId], "Wrong value sent");
        Collection collection = Collection(_collectionAddress);
        address itemOwnerAddress = collection.ownerOf(_itemId);

        // Not able to buy its own token
        require(itemOwnerAddress != msg.sender, "You own this item");

        // Safe transferring the item
        collection.safeTransferFrom(itemOwnerAddress, msg.sender, _itemId);

        // Add paid ethers to the user balance
        userBalance[itemOwnerAddress] += msg.value;

        emit Bought(itemOwnerAddress, msg.sender, msg.value);

        // Item not for sale anymore
        itemPrice[_collectionAddress][_itemId] = 0;

    }

    function getUserCollectionsCount(address _collectionOwnerAddress) external view returns(uint256 count) {
        return userCollections[_collectionOwnerAddress].length;
    }

    function getUserCollections(address _collectionOwnerAddress) external view returns(address[] memory collectionsAddresses) {
        return _getUserCollections(_collectionOwnerAddress, 0, 19);
    }

    function getUserCollections(address _collectionOwnerAddress, uint256 _from, uint256 _to) external view returns(address[] memory collectionsAddresses) {
        return _getUserCollections(_collectionOwnerAddress, _from, _to);
    }

    function _getUserCollections(address _collectionOwnerAddress, uint256 _from, uint256 _to) internal view returns(address[] memory collectionsAddresses) {
        require(_to > _from, "From should be greater than to");
        require((_to - _from) < 20, "Maximum elements is 20");
        require(userCollections[_collectionOwnerAddress].length > 0, "User has no collection");
        require(_from < userCollections[_collectionOwnerAddress].length, "Out of bounds");

        uint256 to;
        if(userCollections[_collectionOwnerAddress].length - 1 < _to) {
            to = userCollections[_collectionOwnerAddress].length - 1;
        } else {
            to = _to;
        }

        address[] memory collections = new address[](to - _from + 1);

        for (uint ij = _from; ij <= to; ij++) {
            collections[ij - _from] = userCollections[_collectionOwnerAddress][ij];
        }

        return collections;
    }
}
