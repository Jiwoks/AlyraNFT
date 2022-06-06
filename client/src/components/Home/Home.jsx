import React from 'react';
import "./Home.css";
import Collections from "../Collections/Collections/Collections";
import walletStore from "../../stores/wallet";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";

function Home() {
    const { address } = walletStore(state => ({address: state.address}));
    const navigate = useNavigate();

    return (
        <div className="Home">
            <Button className="HomeCreateCollection" variant="contained" color="info" onClick={() => navigate('/collections/new')}>New collection</Button>
            {address && <Collections type="user" title="My collections" emptyText="You don't have any collection yet."/> }
            <Collections type="latest" title="Last 10 collections"  emptyText="No collection created yet."/>
        </div>
    );
}

export default Home;
