import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal, Tab} from "semantic-ui-react";
import BookMeeting from "./BookMeeting";
import Schedule from "./Schedule";

function UserView(){
    const [isAuth, setIsAuth] = useState(false)
    const panes = [
        {
            menuItem: 'Booking', render: () => <BookMeeting/>
        },
        {
            menuItem: 'Schedule', render: () => <Schedule/>
        },
        {
            menuItem: 'Room Management', render: () => <Tab.Pane active={isAuth}><BookMeeting/></Tab.Pane>
        }
    ]

    return <Tab panes={panes}/>

}
export default UserView;
