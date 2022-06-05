const {getTransactionEventReturns} = require("../helpers/events");
require('dotenv').config();
const CollectionMaster = artifacts.require("./CollectionMaster.sol");
const Collection = artifacts.require("./Collection.sol");

module.exports = async function(deployer, network) {
    if (network !== 'development') {
        return;
    }
    const collectionMasterInstance = await CollectionMaster.deployed();

    // MoeGirls
    const receipt1 = await collectionMasterInstance.createCollection('MakeGirlMoe', 'MGM', 'AI Generated girls from https://make.girls.moe/');
    const collection1Address = getTransactionEventReturns(receipt1, 'CollectionCreated', 'collectionAddress');

    const collection1Instance = await Collection.at(collection1Address);
    await collection1Instance.mint('ipfs://QmNeEBaSySuDw19rBEUvQb27vVr1LFWkThq4NBfZXNALT4');
    await collection1Instance.mint('ipfs://QmYWkMeSMtMGuMgHSbwQVPSwM6HkLYy6TXXJyNXVcvtzgw');
    await collection1Instance.mint('ipfs://QmeRvdwGUMUXnQHoCUqsESdazCaWW3LYU9JFq5AerAV836');
    await collection1Instance.mint('ipfs://QmPmew9hqGhUSQNnq5Wto3ePaoAKem4FZzHaF14gJWp2Pi');
    await collection1Instance.mint('ipfs://QmTQTH5p81LAJ5uVzp3y1rVwFoEg4QkkzpxPAFB938frjw');
    await collection1Instance.mint('ipfs://QmSEJSX1fbxXnu8CSkpcYFBGeZ2ATjHRhyz4vcvBLafR28');

    await collection1Instance.setApprovalForAll(collectionMasterInstance.address, true);
    await collectionMasterInstance.setItemPrice(collection1Address, '0', web3.utils.toWei('1'));
    await collectionMasterInstance.setItemPrice(collection1Address, '1', web3.utils.toWei('1.5'));

    // Mutant Ape
    const receipt2 = await collectionMasterInstance.createCollection('Mutants Ape Club', 'MAYC', 'Mutant Apes');
    const collection2Address = getTransactionEventReturns(receipt2, 'CollectionCreated', 'collectionAddress');

    const collection2Instance = await Collection.at(collection2Address);
    await collection2Instance.mint('ipfs://QmNypWbzWSAWdmGvex8J6XsLk6WLR2rKmTZMjuzVL4962x');
    await collection2Instance.mint('ipfs://QmUaRZGkqHwfL6h7i4T4catfQgLkhEzgiN8qQCYxySPJG3');
    await collection2Instance.mint('ipfs://Qma7BehT9EWbs7mCw7xAedCtUuVvMzB2dGW72haykBzTGX');
    await collection2Instance.mint('ipfs://QmXFvZn67Vx2rwnvi2UZnCQJwm4wiXkA9MaFhpr21pdmGh');
    await collection2Instance.mint('ipfs://QmSjDVUpZQLHYoZF53J6vmfaoe3BoVtqkRc4G4WuzViyRs');

    await collection2Instance.setApprovalForAll(collectionMasterInstance.address, true);
    await collectionMasterInstance.setItemPrice(collection2Address, '0', web3.utils.toWei('1'));
    await collectionMasterInstance.setItemPrice(collection2Address, '1', web3.utils.toWei('1.5'));

};
