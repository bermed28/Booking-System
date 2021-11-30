import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Tab} from "semantic-ui-react";
import BookMeeting from "./BookMeeting";
import Schedule from "./Schedule";
import Navbar from "./components/Navbar";


function UserView(){

    const panes = [
        {
            menuItem: 'Schedule', render: () => <Schedule/>
        },
        {
            menuItem: 'Booking', render: () => <BookMeeting/>
        }
    ]

    return (
        <>
        <Navbar/>
        <Tab panes={panes}/>
        </>
    );

}
export default UserView;
