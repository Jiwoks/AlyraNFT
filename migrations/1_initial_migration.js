const CollectionMaster = artifacts.require("./CollectionMaster.sol");

module.exports = async function(deployer) {
  await deployer.deploy(CollectionMaster);
};
