import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    palette:{
        primary:{
            light:'#ffffff',
            main:'#fff3e0',
            dark:'#ccc0ae',
            contrastText:'#004d40',
        },
        secondary:{
            light:'#ffffff',
            main:'#e8f5e9',
            dark:'#b6c2b7',
            contrastText:'#00838e',
        },
    }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
