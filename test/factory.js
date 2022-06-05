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

contract("Factory", accounts => {

  beforeEach(async () => {
    await newFactoryInstance();
  });

  it("should create nft collection.", async () => {

    const receipt = await factoryInstance.createCollection('Name', 'Symbol', 'Description');

    expectEvent(receipt, "CollectionCreated", {name: "Name"});
  });

  it("should transfer ownership.", async () => {
    const factoryInstance = await Factory.deployed();

    const receipt = await factoryInstance.createCollection('Name', 'Symbol', 'Description', {from: accounts[1]});

    const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');

    const collectionInstance = await Collection.at(collectionAddress);

    expect(await collectionInstance.owner()).to.be.equals(accounts[1]);
  });

  it("should set name and symbol.", async () => {
    const factoryInstance = await Factory.deployed();

    const receipt = await factoryInstance.createCollection('Say my name', 'Heisenberg', 'You re damn right', {from: accounts[1]});
    const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');

    const collectionInstance = await Collection.at(collectionAddress);

    expect(await collectionInstance.name()).to.be.equals('Say my name');
    expect(await collectionInstance.symbol()).to.be.equals('Heisenberg');
    expect(await collectionInstance.description()).to.be.equals('You re damn right');
  });

  it("should add a collection", async () => {
    const factoryInstance = await Factory.deployed();

    const receipt = await factoryInstance.createCollection('Say my name', 'Heisenberg', 'You re damn right', {from: accounts[0]});
    const collectionAddress = getTransactionEventReturns(receipt, 'CollectionCreated', 'collectionAddress');

    const collectionInstance = await Collection.at(collectionAddress);

    expect(await collectionInstance.name()).to.be.equals('Say my name');
    expect(await collectionInstance.symbol()).to.be.equals('Heisenberg');
    expect(await collectionInstance.description()).to.be.equals('You re damn right');
  });

});
