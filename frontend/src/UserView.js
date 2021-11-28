import React, {Component, useEffect, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal, Tab} from "semantic-ui-react";
import BookMeeting from "./BookMeeting";
import Schedule from "./Schedule";
import Navbar from "./components/Navbar";
import RoomManagement from './RoomManagement';
import {Link} from "react-router-dom";


function UserView(){

    const panes = [
        {
            menuItem: 'Booking', render: () => <BookMeeting/>
        },
        {
            menuItem: 'Schedule', render: () => <Schedule/>
        },
    ]

    return (
        <>
        <Navbar/>
        <Tab panes={panes}/>
        </>
    );

}
export default UserView;
