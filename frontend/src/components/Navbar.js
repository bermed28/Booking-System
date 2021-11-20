import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom"
import * as Icons from "react-icons/fa"
import "./Navbar.css";
import { navItems } from './Navitems';
import Button from './Button';
import Dropdown from "./Dropdown"

const Navbar = () => {
    const [dropdown, setDropdown] = useState(false);
    const navigate = useNavigate();
    let  routeChange = (path) => {
        navigate(`/${path}`);
    }
    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-logo"><Icons.FaCalendarCheck/> Calendearly</Link>
                <ul className="nav-items">
                    {navItems.map(item => {
                        if (item.title === "Statistics") {
                            return (
                                <li key={item.id} className={item.cName} onMouseEnter={() => setDropdown(true)} 
                                onMouseLeave={() => setDropdown(false)}>
                                    <Link to={item.path}>{item.title}</Link>
                                    {/* {dropdown && <Dropdown/>} */}
                                </li>
                            )
                        }

                        return (
                        <li key={item.id} className={item.cName}>
                            <Link to={item.path}>{item.title}</Link>
                        </li>
                    )})}
                </ul>
                <div>
                    <Button text="Sign Up"/>
                    <Button text="Sign In"/>
                </div>
            </nav>
        </>
    );
}

export default Navbar
