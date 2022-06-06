import React from "react";
import './Collection.css';
import {useNavigate, useParams} from "react-router-dom";
import NFT from "../NFT/NFT";
import Button from "@mui/material/Button";
import walletStore from "../../../stores/wallet";
import {useQuery} from "@apollo/client";
import {nftItemsByCollectionQuery} from "../../../helpers/graph";

function Collection() {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const { address } = walletStore(state => ({address: state.address}));

    const { loading, error, data } = useQuery(nftItemsByCollectionQuery, {
        variables: {
            collection: collectionId,
            first: 10
        }
    });

    return (
        <div className="Collection">
            {data !== undefined &&
                <>
                    <h1>{data.collection.name}{(data.collection.owner !== undefined && address && data.collection.owner.toLowerCase() === address.toLowerCase()) &&
                        <Button className="CollectionAddButton" variant="contained" color="info"
                                onClick={() => navigate('/collections/' + collectionId + '/new')}>Add new
                            item</Button>}</h1>
                    {data.collection.description && <p>{data.collection.description}</p>}
                    <div className="CollectionItems">
                        {data.collection.NFTs.map((nft) => {
                            return (
                                <NFT key={nft.id} id={nft.tokenId} uri={nft.uri}/>
                            )
                        })}
                    </div>
                </>
            }
        </div>
    );
}

export default Collection;
