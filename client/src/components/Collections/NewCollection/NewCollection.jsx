import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import './NewCollection.css';
import {Card, CardContent, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {createCollection} from "../../../helpers/contract";

function NewCollection() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({name: '', symbol: '', description: ''});

    useEffect(() => {

    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async () => {
        const receipt = await createCollection(formData.name, formData.symbol, formData.description);
        navigate('/collections/' + receipt.events.CollectionCreated.returnValues.collectionAddress + '/new');
    }

    return (
        <div className="NewCollection">
            <Card>
                <CardContent>
                    <p>You can create a new collection from here<br/>Once the collection created you'll be able to create NFTs inside it.</p>
                    <TextField
                        className="NewCollectionTextField"
                        name="name"
                        label="Collection name"
                        placeholder="My multi-millionaire NFT collection"
                        fullWidth={true}
                        value={formData.name}
                        onChange={handleChange} />
                    <TextField
                        className="NewCollectionTextField"
                        name="symbol"
                        label="Collection symbol"
                        placeholder="MMMNC"
                        fullWidth={true}
                        value={formData.symbol}
                        onChange={handleChange}
                    />
                    <TextField
                        className="NewCollectionTextField"
                        name="description"
                        label="Collection description"
                        fullWidth={true}
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <div className="NewCollectionButtons">
                        <Button className="NewCollectionButtonSave" variant="contained" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button className="NewCollectionButtonSave" disabled={formData.name === '' || formData.symbol === ''} color="success" variant="contained" onClick={handleSubmit}>Save</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default NewCollection;
