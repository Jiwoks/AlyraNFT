import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import './Settings.css';
import {getPinataSettings, setSetting} from "../../helpers/settings";
import {Card, CardContent, TextField} from "@mui/material";
import Button from "@mui/material/Button";

function Settings() {
    const navigate = useNavigate();
    const [stateSetting, setStateSetting] = useState({key: '', secret: ''});

    useEffect(() => {
        setStateSetting(getPinataSettings());
    }, []);

    const handleChange = (e) => {
        switch (e.target.id) {
            case 'apiKey':
                setStateSetting({...stateSetting, key: e.target.value});
                break;
            case 'apiSecret':
                setStateSetting({...stateSetting, secret: e.target.value});
                break;
        }
    }

    const handleSubmit = () => {
        setSetting('pinataApiKey', stateSetting.key);
        setSetting('pinataApiSecret', stateSetting.secret);
        navigate('/');
    }

    return (
        <div className="Settings">
            <Card>
                <CardContent>
                    <TextField className="SettingsTextField" id="apiKey" label="Pinata API Key" fullWidth={true} value={stateSetting.key} onChange={handleChange} />
                    <TextField className="SettingsTextField" id="apiSecret" label="Pinata API Secret" fullWidth={true} value={stateSetting.secret} onChange={handleChange} />
                    <div className="SettingsButtons">
                        <Button className="SettingsButtonSave" variant="contained" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button className="SettingsButtonSave" color="success" variant="contained" onClick={handleSubmit}>Save</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Settings;
