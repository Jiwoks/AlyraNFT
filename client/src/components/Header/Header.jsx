import React from 'react';
import './Header.css';
import Wallet from "./Wallet";
import {ReactComponent as Skull} from '../../assets/skull.svg';
import {Link} from "react-router-dom";

function Header() {

    return (
        <div className="Header">
            <Link className="HeaderIcon" to='/'><Skull /></Link>
            <Wallet />
        </div>
    );
}

export default Header;
