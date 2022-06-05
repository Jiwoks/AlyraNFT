// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is Ownable, ERC721URIStorage {

    string private _name;
    string private _symbol;
    string private _description;
    uint256 private _tokenCount;

    /**
     * @dev Emitted when `tokenId` is minted token from `from`.
     */
    event Minted(address indexed from, uint256 indexed tokenId, string uri);

    constructor() ERC721("", "")  {}

    function init(address owner_, string memory name_, string memory symbol_, string memory description_) external onlyOwner {
        require(keccak256(bytes(_name)) == keccak256(""), "Already initialized");
        transferOwnership(owner_);

        _name = name_;
        _symbol = symbol_;
        _description = description_;
    }

    function name() public override view returns(string memory) {
        return _name;
    }

    function symbol() public override view returns(string memory) {
        return _symbol;
    }

    function description() public view returns(string memory) {
        return _description;
    }

    function mint(string memory tokenURI) public onlyOwner returns(uint256 itemId) {
        _safeMint(msg.sender, _tokenCount);
        _setTokenURI(_tokenCount, tokenURI);

        emit Minted(msg.sender, _tokenCount, tokenURI);

        _tokenCount ++;
        return _tokenCount - 1;
    }
}
