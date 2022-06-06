import React, {useEffect, useState} from "react";
import './NFTDetails.css';
import {Paper} from "@mui/material";
import {
    buyNFT,
    cancelSell,
    checkIPFSUri,
    getNftMetadata,
} from "../../../helpers/contract";
import {Link, Navigate, useParams} from "react-router-dom";
import walletStore from "../../../stores/wallet";
import {ReactComponent as Ethereum} from '../../../assets/ethereum.svg';
import Button from "@mui/material/Button";
import NFTSell from "../NFTSell/NFTSell";
import web3 from "web3";
import {toast} from "react-toastify";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {useQuery} from "@apollo/client";
import {client, nftItemQuery} from "../../../helpers/graph";

function NFTDetails() {
    const [popupOpened, setPopupOpened] = useState(false);
    const [nftMetadata, setNftMetadata] = useState({});
    const { collectionId, itemId } = useParams();
    const { address } = walletStore(state => ({address: state.address}));

    const { loading, error, data, refetch } = useQuery(nftItemQuery, {
        variables: {
            collectionId: collectionId,
            tokenId: itemId
        }
    });

    let collection, nft;
    if (data !== undefined) {
        collection = data.collection;

        if (data.collection.NFTs.length) {
            nft = data.collection.NFTs[0];
        }
    }

    useEffect(() => {
        if (!nft) {
            return;
        }
        updateNFTMetadata();
    }, [nft]);

    if (!loading && !nft) {
        return <Navigate to="/404" />;
    }

    const updateNFTMetadata = () => {
        getNftMetadata(nft.uri).then(metadata => setNftMetadata(metadata));
    }

    if (loading) {
        return <></>
    }

    const changePrice = (cacheItem, value) => {
        client.cache.modify({
            id: client.cache.identify(cacheItem),
            fields: {
                price: (cachedPrice) => value
            }
        });
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
            changePrice(nft, null);
        });
    }

    const buy = async () => {
        await buyNFT(collectionId, itemId);
    }

    const style = {
        backgroundImage: nftMetadata.image ? 'url(' + checkIPFSUri(nftMetadata.image) + ')' : undefined
    };

    let owner = '';
    let isOwner = false;
    if (address && address.toLowerCase() === nft.owner.toLowerCase()) {
        owner = 'you';
        isOwner = true;
    } else {
        owner = nft.owner;
    }

    let attributes = null;
    if (nftMetadata && nftMetadata.attributes) {
        attributes = nftMetadata.attributes;
    }

    let priceInfo = '';
    if (nft.price > 0) {
        priceInfo = (
            <>
                <div className="NFTDetailsPrice">
                    <Ethereum className="NFTDetailsPriceEthereum" />
                    {web3.utils.fromWei(nft.price)}
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
                    <h1><Link className="NFTDetailsCollectionLink" to={'/collections/' + collectionId}><ArrowBackIosNewIcon className="NFTDetailsCollectionLinkBack" /> {data.collection.name} #{itemId}</Link></h1>
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
            <NFTSell popupOpened={popupOpened} setPopupOpened={setPopupOpened} collectionId={collectionId} itemId={itemId} changeNftPrice={(value) => changePrice(nft, value)}/>
        </>
    );
}

export default NFTDetails;
