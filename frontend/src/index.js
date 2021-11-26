import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import HomePage from "./HomePage";
import BookMeeting from "./BookMeeting";
import 'semantic-ui-css/semantic.min.css'
import UserView from "./UserView";
import Dashboard from "./Dashboard";
import App from './App';

window.debug = true;

if(window.debug) window.url = "localhost:8080";
else window.url = "bs-stackoverflowers-backend.herokuapp.com";

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<App/>} />
            <Route exact path="/Home" element={<HomePage/>} />
            <Route exact path="/UserView" element={<UserView/>} />
            <Route exact path="/Dashboard" element={<Dashboard/>} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
