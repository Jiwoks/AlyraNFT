const CollectionMaster = artifacts.require("./CollectionMaster.sol");
const Collection = artifacts.require("./Collection.sol");

const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { getTransactionEventReturns } = require('../helpers/events');


let collectionMasterInstance;
/**
 * Create a new instance of the collection Master
 *
 * @returns {Promise<void>}
 */
const newCollectionMasterInstance = async () => {
  collectionMasterInstance = await CollectionMaster.new();
}

contract("CollectionMaster is Factory", accounts => {

  beforeEach(async () => {
    await newCollectionMasterInstance();
  });

  it("getUserCollectionsCount: should return right count", async () => {
    await collectionMasterInstance.createCollection('Name', 'Symbol', 'Description', {from: accounts[1]});
    expect(await collectionMasterInstance.getUserCollectionsCount(accounts[1])).to.be.bignumber.equals('1');
    await collectionMasterInstance.createCollection('Name', 'Symbol', 'Description', {from: accounts[1]});
    expect(await collectionMasterInstance.getUserCollectionsCount(accounts[1])).to.be.bignumber.equals('2');
  });

  it("createCollection: should create nft collection.", async () => {
    const receipt = await collectionMasterInstance.createCollection('Name', 'Symbol', 'Description');

    expectEvent(receipt, "CollectionCreated", {name: "Name"});
  });

  it("createCollection: should set name and symbol.", async () => {
    const receipt = await collectionMasterInstance.createCollection('Say my name', 'Heisenberg', 'You re damn right', {from: accounts[1]});
    const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');

    const collectionInstance = await Collection.at(collectionAddress);

    expect(await collectionInstance.name()).to.be.equals('Say my name');
    expect(await collectionInstance.symbol()).to.be.equals('Heisenberg');
    expect(await collectionInstance.description()).to.be.equals('You re damn right');
  });

  it("createCollection: should add a collection", async () => {
    const receipt = await collectionMasterInstance.createCollection('Say my name', 'Heisenberg', 'You re damn right', {from: accounts[0]});
    const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');

    const collectionInstance = await Collection.at(collectionAddress);

    expect(await collectionInstance.name()).to.be.equals('Say my name');
    expect(await collectionInstance.symbol()).to.be.equals('Heisenberg');
    expect(await collectionInstance.description()).to.be.equals('You re damn right');
  });

});
