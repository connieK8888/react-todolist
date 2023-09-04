import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, HashRouter } from 'react-router-dom';
// import 'bootstrap/scss/bootstrap.scss';
import './style/sass/all.scss';
import 'bootstrap/dist/js/bootstrap.min.js';
import axios from 'axios';
import { UserProvider } from './context/userContext.jsx';
axios.defaults.baseURL = import.meta.env.VITE_FETCH_API_BASE_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <HashRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </HashRouter>
    // </React.StrictMode>
);


