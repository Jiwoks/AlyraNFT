import React, {useEffect, useState} from 'react';
import './Wallet.css';
import Cookies from 'js-cookie';
import Button from "@mui/material/Button";
import walletStore from '../../stores/wallet';
import {getAccount} from '../../helpers/account';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import LogoutIcon from '@mui/icons-material/Logout';
import {ListItemIcon, Menu, MenuItem, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

function Wallet() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { address, connect, disconnect } = walletStore(state => ({address: state.address, connect: state.connect, disconnect: state.disconnect}));
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    useEffect(() => {
       if (Cookies.get('connected')) {
            handleClick();
       }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (e) => {
        if (address === null) {
            getAccount().then(address => connect(address));
            Cookies.set('connected', 1);
        } else {
            setAnchorEl(e.currentTarget);
            Cookies.remove('connected');
        }
    }

    const handleLogout = () => {
        setAnchorEl(null);
        disconnect();
    }

    const handleMyAccount = () => {
        setAnchorEl(null);
        navigate('/my-account');
    }

    const handleSettings = () => {
        setAnchorEl(null);
        navigate('/settings');
    }

    let textButton = 'Connect';
    if (address) {
        textButton = address.substring(0, 5) + '...' + address.substring(address.length - 3);
    }

    return (
        <div className="Wallet">
            <Button color="inverse" variant="contained" endIcon={<AccountBalanceWalletIcon />} onClick={handleClick}>{textButton}</Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleMyAccount}>
                    <ListItemIcon>
                        <AccountBoxIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">My account</Typography>
                </MenuItem>

                <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                        <SettingsApplicationsIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Settings</Typography>
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Logout</Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default Wallet;
