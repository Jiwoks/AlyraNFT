import React, {useEffect, useState} from "react";
import './Collection.css';
import {useNavigate, useParams} from "react-router-dom";
import {getCollectionDetails, getCollectionItems} from "../../../helpers/contract";
import NFT from "../NFT/NFT";
import Button from "@mui/material/Button";
import walletStore from "../../../stores/wallet";

function Collection() {
    const [NFTs, setNFTs] = useState([]);
    const [collection, setCollection] = useState({});
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const { address } = walletStore(state => ({address: state.address}));

    useEffect(() => {
        getCollectionItems(collectionId).then(nfts => setNFTs(nfts));
        getCollectionDetails(collectionId).then(collection => setCollection(collection));
    }, []);

    return (
        <div className="Collection">
            <h1>{collection.name}{(collection.owner !== undefined && address !== '' && collection.owner.toLowerCase() === address.toLowerCase()) && <Button className="CollectionAddButton" variant="contained" color="info" onClick={() => navigate('/collections/' + collectionId + '/new')}>Add new item</Button>}</h1>
            {collection.description && <p>{collection.description}</p>}
            <div className="CollectionItems">
                {NFTs.map((nft) => {
                    return (
                        <NFT  key={nft.id} id={nft.id} uri={nft.uri} />
                    )
                })}
            </div>
        </div>
    );
}

export default Collection;
