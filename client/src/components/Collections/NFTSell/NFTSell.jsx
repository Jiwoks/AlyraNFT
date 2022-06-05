import React, {useState} from "react";
import './NFTSell.css';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {sellNFT} from "../../../helpers/contract";
import web3 from "web3";
import {toast} from "react-toastify";

function NFTSell({popupOpened, setPopupOpened, collectionId, itemId, updateNFTDetails}) {
    const [price, setPrice] = useState('');
    const [sellDisabled, setSellDisabled] = useState(true);

    const handleClose = () => {
        setPopupOpened(false);
    }

    const handleSell = async () => {
        setSellDisabled(true);
        await toast.promise(
            sellNFT(collectionId, itemId, web3.utils.toWei(price)),
            {
                pending: 'Listing NFT ...',
                success: 'Your NFT has been listed 👌',
                error: {
                    render: (data) => {
                        let errorMessage = 'Listing failed';
                        if (data.data !== undefined && data.data.message !== undefined) {
                            errorMessage += ' ' + data.data.message;
                        }
                        return errorMessage;
                    }
                }
            }
        ).then(() => {
            handleClose();
            updateNFTDetails();
        }).finally(() => {
            setSellDisabled(false);
        });
    }

    const handleChange = (e) => {
        setPrice(e.target.value);
        setSellDisabled(!parseFloat(price) || parseFloat(price) <= 0);
    }

    return (
        <Dialog open={popupOpened} onClose={handleClose}>
            <DialogTitle>Sell</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Set a fixed price you want to sell your NFT for.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="price"
                    label="Price in ETH"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    value={price}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={sellDisabled} onClick={handleSell}>Set sell price</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NFTSell;
