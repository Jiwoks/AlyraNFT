import React, {useEffect, useState} from "react";
import './NFTDetails.css';
import {Paper} from "@mui/material";
import {
    buyNFT,
    cancelSell,
    checkIPFSUri,
    getCollectionDetails,
    getNftDetails,
} from "../../../helpers/contract";
import {useParams} from "react-router-dom";
import walletStore from "../../../stores/wallet";
import {ReactComponent as Ethereum} from '../../../assets/ethereum.svg';
import Button from "@mui/material/Button";
import NFTSell from "../NFTSell/NFTSell";
import web3 from "web3";
import {toast} from "react-toastify";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function NFTDetails() {
    const [NFT, setNFT] = useState({
        metadata: {},
    });
    const [collection, setCollection] = useState({});
    const [popupOpened, setPopupOpened] = useState(false);
    const { collectionId, itemId } = useParams();
    const { address } = walletStore(state => ({address: state.address}));

    useEffect(() => {
        getCollectionDetails(collectionId).then((collection) => setCollection(collection));
        updateNFTDetails();
    }, []);

    const updateNFTDetails = () => {
        getNftDetails(collectionId, itemId).then(nft => setNFT(nft));
    }

    const cancelListing = async () => {
        await toast.promise(
            cancelSell(collectionId, itemId),
            {
                pending: 'Canceling listing ...',
                success: 'Your NFT has been unlisted 👌',
                error: {
                    render: (data) => {
                        let errorMessage = 'Canceling failed';
                        if (data.data !== undefined && data.data.message !== undefined) {
                            errorMessage += ' ' + data.data.message;
                        }
                        return errorMessage;
                    }
                }
            }
        ).then(() => {
            updateNFTDetails();
        });
    }

    const buy = async () => {
        await buyNFT(collectionId, itemId);
    }

    const style = {
        backgroundImage: NFT.metadata.image ? 'url(' + checkIPFSUri(NFT.metadata.image) + ')' : undefined
    };

    let owner = '';
    let isOwner = false;
    if (address !== '' && NFT.owner !== undefined) {
        if (address.toLowerCase() === NFT.owner.toLowerCase()) {
            owner = 'you';
            isOwner = true;
        } else {
            owner = NFT.owner;
        }

    }

    let attributes = null;
    if (NFT.metadata && NFT.metadata.attributes) {
        attributes = NFT.metadata.attributes;
    }

    let priceInfo = '';
    if (NFT.price > 0) {
        priceInfo = (
            <>
                <div className="NFTDetailsPrice">
                    <Ethereum className="NFTDetailsPriceEthereum" />
                    {web3.utils.fromWei(NFT.price)}
                    {!isOwner && <Button className="NFTDetailsBuyButton" variant="contained" color="info" onClick={() => {buy()}}>Buy</Button>}
                    {isOwner && <Button className="NFTDetailsBuyButton" variant="contained" color="info" onClick={cancelListing}>Cancel</Button>}
                </div>
            </>
        )
    } else {
        priceInfo = (
            <>
                {isOwner && <Button variant="contained" color="info" onClick={() => {setPopupOpened(true)}}>Sell</Button>}
            </>
        );
    }

    return (
        <>
            <div className="NFTDetails">
                <div className="NFTDetailsImageWrapper">
                    <div className="NFTDetailsImage">
                        <Paper className="NFTPaper" elevation={3}>
                            <div className="NFTImage" style={style}>&nbsp;</div>
                        </Paper>
                    </div>
                    {priceInfo}
                </div>
                <div className="NFTDetailsInfosWrapper">
                    <h1><a className="NFTDetailsCollectionLink" href={'/collections/' + collectionId}><ArrowBackIosNewIcon className="NFTDetailsCollectionLinkBack" /> {collection.name} #{itemId}</a></h1>
                    <p>Owner : {owner}</p>
                    <p>{collection.description}</p>
                    {attributes !== null && <div>
                        <div className="NFTDetailsAttributes">
                            <h2>Attributes</h2>
                            {attributes.map((attribute) => {
                                return (
                                    <p key={attribute.trait_type}><strong>{attribute.trait_type}</strong> : {attribute.value}</p>
                                )
                            })}
                        </div>
                    </div>}
                </div>
            </div>
            <NFTSell popupOpened={popupOpened} setPopupOpened={setPopupOpened} collectionId={collectionId} itemId={itemId} updateNFTDetails={updateNFTDetails}/>
        </>
    );
}

export default NFTDetails;
