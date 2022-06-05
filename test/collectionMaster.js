const CollectionMaster = artifacts.require("./CollectionMaster.sol");
const Collection = artifacts.require("./Collection.sol");
const Factory = artifacts.require("./Factory.sol");

const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { getTransactionEventReturns } = require('../helpers/events');

let collectionMasterInstance;
/**
 * Create a new instance of the factory
 *
 * @returns {Promise<void>}
 */
const newCollectionMasterInstance = async () => {
  collectionMasterInstance = await CollectionMaster.new();
}

/**
 * Create a new collection and gives approval to master contract
 *
 * @param name
 * @param symbol
 * @param description
 * @return {Promise<any>}
 */
const newCollectionInstance = async (name = 'Name', symbol = 'Symbol', description = 'Description') => {
  const factoryInstance = await Factory.new(collectionMasterInstance.address);
  await collectionMasterInstance.transferOwnership(factoryInstance.address);
  const receipt = await factoryInstance.createCollection(name, symbol, description);
  const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');
  const collectionInstance = await Collection.at(collectionAddress);
  await collectionInstance.setApprovalForAll(collectionMasterInstance.address, true);
  return collectionInstance;
}

/**
 * Create a new collection and mint `count`items
 *
 * @param count
 * @return {Promise<*>}
 */
const newCollectionInstanceMinted = async (count = 1) => {
  const collectionInstance = await newCollectionInstance();

  for (let ij = 0; ij < count; ij++) {
    await collectionInstance.mint('ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  }

  return collectionInstance;
}


contract("CollectionMaster", accounts => {

  beforeEach(async () => {
    await newCollectionMasterInstance();
  });

  it("createCollection: should only be allowed to owner.", async () => {
    await expectRevert(collectionMasterInstance.createCollection(accounts[1], accounts[2], {from: accounts[1]}), ' Ownable: caller is not the owner');
    await collectionMasterInstance.createCollection(accounts[1], accounts[2]);
  });

  it("getUserCollectionsCount: should return right count", async () => {
    await collectionMasterInstance.createCollection(accounts[1], accounts[2]);
    expect(await collectionMasterInstance.getUserCollectionsCount(accounts[1])).to.be.bignumber.equals('1');
    await collectionMasterInstance.createCollection(accounts[1], accounts[2]);
    expect(await collectionMasterInstance.getUserCollectionsCount(accounts[1])).to.be.bignumber.equals('2');
  });

  it("getUserCollections: should revert if parameters are wrong", async () => {
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0], '10', '10'), 'From should be greater than to');
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0], '10', '9'), 'From should be greater than to');
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0], '14', '9'), 'From should be greater than to');
  });

  it("getUserCollections: should revert if user has no collection", async () => {
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0]), 'User has no collection');
  });

  it("getUserCollections: should revert if querying too many items", async () => {
    await collectionMasterInstance.createCollection(accounts[0], accounts[1]);
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0], '0', '20'), 'Maximum elements is 20');
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0], '0', '50'), 'Maximum elements is 20');
  });

  it("getUserCollections: should revert if _from is out of bounds", async () => {
    for (let ij = 0; ij < 10; ij++) {
      const account = web3.eth.accounts.create();
      await collectionMasterInstance.createCollection(accounts[0], account.address);
    }
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0], '10', '11'), 'Out of bounds');
    await expectRevert(collectionMasterInstance.getUserCollections(accounts[0], '20', '30'), 'Out of bounds');

  });

  it("should retrieve collections without giving `from` and `to` parameters", async () => {
    const collectionsAddresses = [];
    const account = web3.eth.accounts.create();
    collectionsAddresses.push(account.address);
    await collectionMasterInstance.createCollection(accounts[0], account.address);

    let collections = await collectionMasterInstance.getUserCollections(accounts[0]);
    expect(collections).to.be.deep.equals(collectionsAddresses);

    for (let ij = 5; ij < 1; ij++) {
      const account = web3.eth.accounts.create();
      collectionsAddresses.push(account.address);
      await collectionMasterInstance.createCollection(accounts[0], account.address);
    }

    collections = await collectionMasterInstance.getUserCollections(accounts[0]);
    expect(collections).to.be.deep.equals(collectionsAddresses);

    for (let ij = 0; ij < 5; ij++) {
      const account = web3.eth.accounts.create();
      collectionsAddresses.push(account.address);
      await collectionMasterInstance.createCollection(accounts[0], account.address);
    }

    collections = await collectionMasterInstance.getUserCollections(accounts[0]);
    expect(collections).to.be.deep.equals(collectionsAddresses.slice(0, 20));
  });

  it("should retrieve collections giving `from` and `to` parameters", async () => {
    const collectionsAddresses = [];
    for (let ij = 0; ij < 5; ij++) {
      const account = web3.eth.accounts.create();
      collectionsAddresses.push(account.address);
      await collectionMasterInstance.createCollection(accounts[0], account.address);
    }

    let collections = await collectionMasterInstance.getUserCollections(accounts[0]);
    expect(collections).to.be.deep.equals(collectionsAddresses);

    for (let ij = 0; ij < 5; ij++) {
      const account = web3.eth.accounts.create();
      collectionsAddresses.push(account.address);
      await collectionMasterInstance.createCollection(accounts[0], account.address);
    }

    collections = await collectionMasterInstance.getUserCollections(accounts[0]);
    expect(collections).to.be.deep.equals(collectionsAddresses.slice(0, 20));
  });

  it("should check that token is approved when setting item price", async () => {
    const factoryInstance = await Factory.new(collectionMasterInstance.address);
    await collectionMasterInstance.transferOwnership(factoryInstance.address);
    const receipt = await factoryInstance.createCollection('Name', 'Symbol', 'Description');
    const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');
    const collectionInstance = await Collection.at(collectionAddress);
    await collectionInstance.mint('ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await expectRevert(collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('1')), "Approval required");
    await collectionInstance.approve(collectionMasterInstance.address, '0');
    await collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('1'));
  });

  it("should check that user is approved for all when setting item price", async () => {
    const factoryInstance = await Factory.new(collectionMasterInstance.address);
    await collectionMasterInstance.transferOwnership(factoryInstance.address);
    const receipt = await factoryInstance.createCollection('Name', 'Symbol', 'Description');
    const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');
    const collectionInstance = await Collection.at(collectionAddress);
    await collectionInstance.mint('ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await expectRevert(collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('1')), "Approval required");
    await collectionInstance.setApprovalForAll(collectionMasterInstance.address, true);
    await collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('1'));
  });

  it("should set item price", async () => {
    const collectionInstance = await newCollectionInstanceMinted();
    await collectionInstance.setApprovalForAll(collectionMasterInstance.address, true);
    expect(await collectionMasterInstance.itemPrice(collectionInstance.address, '0')).to.be.bignumber.equals('0');
    await collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('1'));
    expect(await collectionMasterInstance.itemPrice(collectionInstance.address, '0')).to.be.bignumber.equals(web3.utils.toWei('1'));
  });

  it("should not be able to buy already owned item", async () => {
    const collectionInstance = await newCollectionInstanceMinted();
    await collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('1'));
    await expectRevert(collectionMasterInstance.buy(collectionInstance.address, '0', {value: web3.utils.toWei('1')}), "You own this item");
  });

  it("should not be able to buy if the ether sent is not equal to the item price", async () => {
    const collectionInstance = await newCollectionInstanceMinted();
    await collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('2'));
    await expectRevert(collectionMasterInstance.buy(collectionInstance.address, '0', {value: web3.utils.toWei('1')}), "Wrong value sent");
  });

  it("should buy an item", async () => {
    const collectionInstance = await newCollectionInstanceMinted();
    await collectionMasterInstance.setItemPrice(collectionInstance.address, '0', web3.utils.toWei('2'));
    expect(await collectionMasterInstance.userBalance(accounts[0])).to.be.bignumber.equals('0');
    await collectionMasterInstance.buy(collectionInstance.address, '0', {from: accounts[1], value: web3.utils.toWei('2')});
    expect(await collectionMasterInstance.userBalance(accounts[0])).to.be.bignumber.equals(web3.utils.toWei('2'));
  });

});
