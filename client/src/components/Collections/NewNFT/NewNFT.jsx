import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import './NewNFT.css';
import {Card, CardContent, Tab, Tabs, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {mintNFT, uploadAndMintNFTFromMetadataFile} from "../../../helpers/contract";
import {getPinataSettings} from "../../../helpers/settings";
import {toast} from "react-toastify";
import {client} from "../../../helpers/graph";
import {gql} from "@apollo/client";

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
        let promise;
        if (tab === 0) {
            promise = mintNFT(collectionId, formData.uri);
        } else if (tab === 1) {
            promise = uploadAndMintNFTFromMetadataFile(collectionId, formData.file);
        }

        await toast.promise(
            promise,
            {
                pending: 'Minting NFT ...',
                success: 'Your NFT has been minted 👌',
                error: {
                    render: (data) => {
                        let errorMessage = 'Minting failed';
                        if (data.data !== undefined && data.data.message !== undefined) {
                            errorMessage += ' ' + data.data.message;
                        }
                        return errorMessage;
                    }
                }
            }
        ).then((data) => {

            const newNFT = {
                __typename: 'NFTItem',
                id: collectionId + '-' + data.events.Minted.returnValues.tokenId,
                tokenId: data.events.Minted.returnValues.tokenId,
                owner: data.events.Minted.returnValues.from,
                uri: data.events.Minted.returnValues.uri,
                price: null,
                collection: collectionId
            };

            client.cache.modify({
                id: 'Collection:' + collectionId,
                fields: {
                    NFTs(existingNFTsRefs = [], { readField }) {
                        const newNFTRef = client.cache.writeFragment({
                            data: newNFT,
                            fragment: gql`
                                fragment newNFT on NFTItem {
                                    id
                                    tokenId
                                    owner
                                    uri
                                    price
                                    collection
                                }
                            `
                        });

                        // Quick safety check - if the new comment is already
                        // present in the cache, we don't need to add it again.
                        if (existingNFTsRefs.some(
                            ref => readField('id', ref) === newNFT.id
                        )) {
                            return existingNFTsRefs;
                        }

                        console.log([...existingNFTsRefs, newNFTRef])

                        return [...existingNFTsRefs, newNFTRef];
                    }
                },
                broadcast: false
            });

            handleCancel();
        });



    }

    const handleTabChange = (e, tab) => {
        setTab(tab);
    }

    const handleCancel = () => {
        navigate('/collections/' + collectionId)
    }

    let disabled = true;
    if (tab === 0 && formData.uri !== '') {
        disabled = false;
    } else if (tab === 1 &&  formData.file.name === '') {

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
                    <Button className="NewNFTButtonSave" variant="contained" onClick={handleCancel}>Cancel</Button>
                    <Button className="NewNFTButtonSave" disabled={disabled} color="success" variant="contained" onClick={handleSubmit}>Save</Button>
                </div>
                </CardContent>

            </Card>
        </div>
    );
}

export default NewNFT;
