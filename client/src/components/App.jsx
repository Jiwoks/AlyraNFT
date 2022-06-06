import React, {useState} from "react";
import Main from "./Main/Main";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Waves from "./Waves/Waves";
import {ReactComponent as Island} from '../assets/island.svg';
import {ApolloProvider} from "@apollo/client";
import {client} from "../helpers/graph";

const theme = createTheme({
    palette: {
        primary: {
            main: "#096bb2",
            light: "#fff"
        },
        inverse: {
            main: "#fff",
            light: "#08b6ff",
            contrastText: "#096bb2",
        }
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                variant: "contained"
            },
        },
    }
});

function App() {
    const [is404, set404] = useState(false);

    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <div className="cloud x1"></div>
                <div className="cloud x2"></div>
                <div className="cloud x3"></div>
                <div className="cloud x4"></div>
                <div className="cloud x5"></div>

                <ThemeProvider theme={theme}>
                    <Main set404={set404}/>
                    <Waves/>
                    {is404 && <Island className="AppIsland" />}
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </ThemeProvider>
            </BrowserRouter>
        </ApolloProvider>
);
}

export default App;
