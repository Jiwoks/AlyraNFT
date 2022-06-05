const CollectionMaster = artifacts.require("./CollectionMaster.sol");
const Factory = artifacts.require("./Factory.sol");
const Collection = artifacts.require("./Collection.sol");

const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { getTransactionEventReturns } = require('../helpers/events');

let collectionMasterInstance, factoryInstance;
/**
 * Create a new instance of the factory
 *
 * @returns {Promise<void>}
 */
const newFactoryInstance = async () => {
  collectionMasterInstance = await CollectionMaster.new();
  factoryInstance = await Factory.new(collectionMasterInstance.address);
  await collectionMasterInstance.transferOwnership(factoryInstance.address);
}

let collectionInstance;
/**
 * Create a new collection
 * @param account
 * @return {Promise<void>}
 */
const newCollectionInstance = async (account) => {
  const receipt = await factoryInstance.createCollection('Name', 'Symbol', 'Description');
  const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');
  collectionInstance = await Collection.at(collectionAddress);
}

contract("Collection", accounts => {
  before(async () => {
    await newFactoryInstance();
  });

  beforeEach(async () => {
    await newCollectionInstance();
  });

  it("should mint only be allowed to owner.", async () => {

    await expectRevert(collectionInstance.mint('ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx', {from: accounts[1]}), ' Ownable: caller is not the owner');
    await collectionInstance.mint('');
  });

  it("should mint new item and increment balance.", async () => {
    expect(await collectionInstance.balanceOf(accounts[0])).to.be.bignumber.equals('0');
    await collectionInstance.mint('ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expect(await collectionInstance.balanceOf(accounts[0])).to.be.bignumber.equals('1');
  });

  it("should mint new item and emit Mint event.", async () => {
    let receipt = await collectionInstance.mint('ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expectEvent(receipt, "Mint", {from: accounts[0], tokenId: '0', uri: 'ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx'});
    receipt = await collectionInstance.mint('ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx2');
    expectEvent(receipt, "Mint", {from: accounts[0], tokenId: '1', uri: 'ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx2'});
  });

});
