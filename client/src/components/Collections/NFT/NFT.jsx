import React, {useEffect, useState} from "react";
import './NFT.css';
import {Paper} from "@mui/material";
import {checkIPFSUri, getNftMetadata} from "../../../helpers/contract";
import {Link, useParams} from "react-router-dom";

function NFT({id, uri}) {
    const [NFT, setNFT] = useState([]);
    const { collectionId } = useParams();

    useEffect(() => {
        getNftMetadata(uri).then(nft => setNFT(nft));
    }, []);

    const style = {
        backgroundImage: NFT.image ? 'url(' + checkIPFSUri(NFT.image) + ')' : undefined
    };

    return (
        <Link className="NFT" to={'/collections/' + collectionId + '/' + id}>
            <Paper className="NFTPaper" elevation={3}>
                <div className="NFTId">#{id}</div>
                <div className="NFTImage" style={style}>&nbsp;</div>
                <div className="NFTName">{NFT.name !== undefined && NFT.name}</div>
            </Paper>
        </Link>
    );
}

export default NFT;
