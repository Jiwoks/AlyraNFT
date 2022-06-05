const getSettings = () => {
    const settings = sessionStorage.getItem('settings');

    if (settings === null) {
        return {};
    }

    try {
        return JSON.parse(settings);
    } catch (e) {
        return {};
    }
}

const setSetting = (name, value) => {
    const settings = getSettings();
    settings[name] = value;
    sessionStorage.setItem('settings', JSON.stringify(settings));
}

const getPinataSettings = () => {
    const settings = getSettings();

    const newState = {
        key: '',
        secret: '',
    }
    if (settings.pinataApiKey !== undefined) {
        newState.key = settings.pinataApiKey;
    }
    if (settings.pinataApiSecret !== undefined) {
        newState.secret = settings.pinataApiSecret;
    }

    return newState;
}


export {
    getSettings,
    setSetting,
    getPinataSettings
}
