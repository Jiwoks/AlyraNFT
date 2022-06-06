import React, {useEffect, useState} from "react";
import './CollectionItem.css';
import {checkIPFSUri, getNftMetadata} from "../../../helpers/contract";
import {useNavigate} from "react-router-dom";
import {ReactComponent as Skull} from '../../../assets/skull.svg';
import {useQuery} from "@apollo/client";
import {nftItemsByCollectionQuery} from "../../../helpers/graph";

function CollectionItem({collection}) {
    const [nft, setNft] = useState({});

    const { loading, error, data } = useQuery(nftItemsByCollectionQuery, {
        variables: {
            collection: collection.id,
            first: 1
        }
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (data == undefined || !data.collection.NFTs.length) {
            return;
        }
        getNftMetadata(data.collection.NFTs[0].uri).then(nft => setNft(nft));
    }, [data]);

    const style = {
        backgroundImage: nft.image ? 'url(' + checkIPFSUri(nft.image) + ')' : <Skull />
    };

    return (
        <div className="CollectionItem" onClick={() => navigate('/collections/'+collection.id)}>
            <div className="CollectionItemImage" style={style}>&nbsp;</div>
            <p className="CollectionItemTitle">{collection.name}</p>
            {collection.description && <p className="CollectionItemDescription">{collection.description}</p>}
        </div>
    );
}

export default CollectionItem;
