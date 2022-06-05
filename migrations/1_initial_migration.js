const Factory = artifacts.require("./Factory.sol");
const CollectionMaster = artifacts.require("./CollectionMaster.sol");

module.exports = async function(deployer) {
  await deployer.deploy(CollectionMaster);
  await deployer.deploy(Factory, CollectionMaster.address);
  const collectionMasterInstance = await CollectionMaster.deployed();
  await collectionMasterInstance.transferOwnership(Factory.address);
};
