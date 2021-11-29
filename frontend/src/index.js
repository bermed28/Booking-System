import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import Login from "./Login";
import BookMeeting from "./BookMeeting";
import 'semantic-ui-css/semantic.min.css'
import UserView from "./UserView";
import Dashboard from "./Dashboard";
import App from './App';
import Signup from "./Signup";
import Settings from "./Settings";
import RoomManagement from "./RoomManagement";


ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<App/>} />
            <Route exact path="/Login" element={<Login/>} />
            <Route exact path="/UserView" element={<UserView/>} />
            <Route exact path="/Dashboard" element={<Dashboard/>} />
            <Route exact path="/Signup" element={<Signup/>} />
            <Route exact path="/Settings" element={<Settings/>} />
            <Route exact path="/RoomManagement" element={<RoomManagement/>} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
