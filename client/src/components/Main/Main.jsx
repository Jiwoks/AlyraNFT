import React, {useEffect} from 'react';
import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import "./Main.css";
import Settings from "../Settings/Settings";
import NotFound from "../NotFound/NotFound";
import NewCollection from "../Collections/NewCollection/NewCollection";
import NewNFT from "../Collections/NewNFT/NewNFT";
import Collection from "../Collections/Collection/Collection";
import web3 from "../../helpers/web3";
import {loadMainContracts} from "../../helpers/contract";
import {CircularProgress} from "@mui/material";
import Home from "../Home/Home";
import NFTDetails from "../Collections/NFTDetails/NFTDetails";

function Main({set404}) {

    useEffect(() => {
        (async () => {
            await web3;
            await loadMainContracts();
        })();
    }, []);

    return (
        <div className="Main">
            <>
                <Header/>
                <div className="Content">
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/collections/new" element={<NewCollection/>}/>
                        <Route path="collections/:collectionId" element={<Collection/>}/>
                        <Route path="collections/:collectionId/new" element={<NewNFT/>}/>
                        <Route path="collections/:collectionId/:itemId" element={<NFTDetails />}/>
                        <Route path="*" element={<NotFound set404={set404} />}/>
                    </Routes>
                </div>
            </>
        </div>
    );
}

export default Main;
