import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import './NewNFT.css';
import {Card, CardContent, Tab, Tabs, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {mintNFT, uploadAndMintNFTFromMetadataFile} from "../../../helpers/contract";
import {getPinataSettings} from "../../../helpers/settings";

function NewNFT() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({uri: '', file: {name: ''}});
    const [pinataAvailable, setPinataAvailable] = useState(false);
    const [tab, setTab] = useState(0);
    const { collectionId } = useParams();

    useEffect(() => {
        const settings = getPinataSettings();
        if (settings.key && settings.secret) {
            setPinataAvailable(true);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({...formData, [e.target.name]: e.target.files[0]});
        } else {
            setFormData({...formData, [e.target.name]: e.target.value});
        }
    }

    const handleSubmit = async () => {
        if (tab === 0) {
            const receipt = await mintNFT(collectionId, formData.uri);
        } else if (tab === 1) {
            const receipt = await uploadAndMintNFTFromMetadataFile(collectionId, formData.file);
        }

    }

    const handleTabChange = (e, tab) => {
        setTab(tab);
    }

    return (
        <div className="NewNFT">
            <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Direct upload" />
                <Tab label="Pinata upload" />
            </Tabs>
            <Card>
                <CardContent>
                {tab === 0 &&
                    <>
                        <p>It's time to add some NFT to your collection {collectionId}</p>
                        <p>Set the metadata file uri which represents your NFT (see <a href="https://docs.opensea.io/docs/metadata-standards" target="_blank">Opensea documentation</a></p>
                        <TextField
                            className="NewNFTTextField"
                            name="uri"
                            label="Uri"
                            placeholder="ipfs://ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxx"
                            fullWidth={true}
                            value={formData.uri}
                            onChange={handleChange}
                            size="small" />

                    </>
                }
                {tab === 1 &&
                    <>
                        {!pinataAvailable && <p>Please set Pinata API and Key in the settings in the <Link to='/settings'>Settings page</Link></p>}
                        {pinataAvailable && <>
                            <p>You have already a <strong>metadata file locally</strong> and want to upload it to Pinata ? Select your metadata file and press save</p>
                            <TextField
                                className="NewNFTFileTextField"
                                type="file"
                                name="file"
                                label="File"
                                fullWidth={true}
                                onChange={handleChange}
                                size="small"
                                focused
                                />
                        </>}
                    </>
                }
                <div className="NewNFTButtons">
                    <Button className="NewNFTButtonSave" variant="contained" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button className="NewNFTButtonSave" disabled={formData.name === '' || formData.symbol === ''} color="success" variant="contained" onClick={handleSubmit}>Save</Button>
                </div>
                </CardContent>

            </Card>
        </div>
    );
}

export default NewNFT;
