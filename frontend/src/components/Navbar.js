import React from 'react'
import {Link} from "react-router-dom"
import * as Icons from "react-icons/fa"
import "./Navbar.css";
import { navItems } from './Navitems';
import Button from './Button';
import Dropdown from "./Dropdown"

const Navbar = () => {
    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-logo"><Icons.FaCalendarCheck/> Calendearly</Link>
                <ul className="nav-items">
                    {navItems.map(item => {
                        return (<li key={item.id} className={item.cName}>
                            <Link to={item.path}>{item.title}</Link>
                        </li>
                    )})}
                </ul>
                <div>
                    <Button text="Sign Up"/>
                    <Button text="Sign In"/>
                </div>
            </nav>
            {/* <Dropdown/> */}
        </>
    )
}

export default Navbar
