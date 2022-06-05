import factoryContract from '../contracts/Factory.json';
import collectionMasterContract from '../contracts/CollectionMaster.json';
import collectionContract from '../contracts/Collection.json';
import contractStore from '../stores/contract';
import web3 from "./web3";
import walletStore from '../stores/wallet';
import axios from "axios";
import {getPinataSettings} from "./settings";

let collectionMasterContractInstance;

/**
 * Load the contract with our web3 provider
 *
 * @return {Promise<void>}
 */
async function loadMainContracts() {
    const web3Provider = await web3;
    const networkId = await web3Provider.eth.net.getId();

    if (
        !collectionMasterContract.networks[networkId] ||
        !collectionMasterContract.networks[networkId].address
    ) {
        contractStore.setState({noContractSet: true});
        return;
    }

    collectionMasterContractInstance = new web3Provider.eth.Contract(
        collectionMasterContract.abi,
        collectionMasterContract.networks[networkId].address,
    );
}

async function loadCollectionContract(contractAddress) {
    const web3Provider = await web3;

    return new web3Provider.eth.Contract(
        collectionContract.abi,
        contractAddress,
    );
}

/**
 * Create a new collection
 *
 * @param name
 * @param symbol
 * @param description
 * @return {Promise<*>}
 */
async function createCollection(name, symbol, description) {
    const walletAddress = walletStore.getState().address;
    return await collectionMasterContractInstance.methods.createCollection(name, symbol, description).send({from: walletAddress});
}

/**
 * Create a new NFT within a collection
 *
 * @return {Promise<*>}
 */
async function mintNFT(collectionAddress, uri) {
    const walletAddress = walletStore.getState().address;
    return await (await loadCollectionContract(collectionAddress)).methods.mint(uri).send({from: walletAddress});
}

async function getUserCollections(from = 0, to = 19) {
    from = from.toString();
    to = to.toString();
    const walletAddress = walletStore.getState().address;
    try {
        return await collectionMasterContractInstance.methods.getUserCollections(walletAddress, from, to).call();
    } catch (e) {
        return [];
    }
}

async function uploadAndMintNFTFromMetadataFile(collectionAddress, file) {
    const settings = getPinataSettings();
    const formData = new FormData();
    formData.append('file', file);
    const result = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxContentLength: "Infinity",
        headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': settings.key,
            'pinata_secret_api_key': settings.secret
        }
    });
    return mintNFT(collectionAddress, 'ipfs://ipfs/' + result.data.IpfsHash);
}


async function getLatestCollections() {
    try {
        const events = await collectionMasterContractInstance.getPastEvents('CollectionCreated', {fromBlock: 0});
        const collections = [];
        for(const event of events.splice(-10)) {
            collections.push(event.returnValues.collectionAddress)
        }
        return collections;
    } catch (e) {
        return [];
    }
}

async function getCollectionItems(collectionAddress) {
    try {
        const NFTs = [];

        const events = await (await loadCollectionContract(collectionAddress)).getPastEvents('Mint', {fromBlock: 0});
        for (const event of events) {

            NFTs.push({
                id: event.returnValues.tokenId,
                uri: event.returnValues.uri,
            });
        }

        return NFTs;
    } catch (e) {
        return [];
    }
}

async function getCollectionDetails(collectionAddress) {
    const collectionInstance = await loadCollectionContract(collectionAddress);
    const name = await collectionInstance.methods.name().call();
    const symbol = await collectionInstance.methods.symbol().call();
    const description = await collectionInstance.methods.description().call();
    const owner = await collectionInstance.methods.owner().call();
    return {
        name,
        symbol,
        description,
        owner
    }
}

async function getNftDetails(collectionAddress, NftId) {
    const collectionInstance = await loadCollectionContract(collectionAddress);
    const uri = await collectionInstance.methods.tokenURI(NftId).call();
    const owner = await collectionInstance.methods.ownerOf(NftId).call();
    const price = await collectionMasterContractInstance.methods.itemPrice(collectionAddress, NftId).call();
    const metadata = await getNftMetadata(uri);
    return {
        owner,
        metadata,
        price,
    };
}

async function getNftMetadata(uri) {
    const response = await axios({
        method: 'get',
        url: checkIPFSUri(uri),
    });

    return response.data;
}

/**
 * Replace ipfs:// with an ipfs provider
 * @param uri
 * @returns {*}
 */
function checkIPFSUri(uri) {
    return uri.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
}

async function buyNFT(collectionAddress, NftId) {
    const walletAddress = walletStore.getState().address;
    const price = await collectionMasterContractInstance.methods.itemPrice(collectionAddress, NftId).call();
    await collectionMasterContractInstance.methods.buy(collectionAddress, NftId).send({
        value: price,
        from: walletAddress
    });
}

async function sellNFT(collectionAddress, NftId, price) {
    const walletAddress = walletStore.getState().address;
    const collectionInstance = await loadCollectionContract(collectionAddress);
    await collectionInstance.methods.approve(collectionMasterContractInstance._address, NftId).send({from: walletAddress});
    await collectionMasterContractInstance.methods.setItemPrice(collectionAddress, NftId, price).send({from: walletAddress});
}

async function cancelSell(collectionAddress, NftId) {
    const walletAddress = walletStore.getState().address;
    await collectionMasterContractInstance.methods.setItemPrice(collectionAddress, NftId, 0).send({from: walletAddress});
}

export {
    loadMainContracts,
    createCollection,
    mintNFT,
    uploadAndMintNFTFromMetadataFile,
    getUserCollections,
    getLatestCollections,
    getCollectionItems,
    getNftMetadata,
    checkIPFSUri,
    getNftDetails,
    getCollectionDetails,
    buyNFT,
    sellNFT,
    cancelSell
};
