import React, {useEffect, useState} from "react";
import './CollectionItem.css';
import {checkIPFSUri, getCollectionDetails, getCollectionItems, getNftMetadata} from "../../../helpers/contract";
import {useNavigate} from "react-router-dom";
import {ReactComponent as Skull} from '../../../assets/skull.svg';

function CollectionItem({collectionId}) {
    const [nft, setNft] = useState({});
    const [collection, setCollection] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getCollectionItems(collectionId).then(nfts => {
            if(nfts.length) {
                getNftMetadata(nfts[0].uri).then(nft => setNft(nft));
            }
        });
        getCollectionDetails(collectionId).then(collection => setCollection(collection));
    }, []);

    const style = {
        backgroundImage: nft.image ? 'url(' + checkIPFSUri(nft.image) + ')' : <Skull />
    };

    return (
        <div className="CollectionItem" onClick={() => navigate('/collections/'+collectionId)}>
            <div className="CollectionItemImage" style={style}>&nbsp;</div>
            <p className="CollectionItemTitle">{collection.name}</p>
            {collection.description && <p className="CollectionItemDescription">{collection.description}</p>}
        </div>
    );
}

export default CollectionItem;
