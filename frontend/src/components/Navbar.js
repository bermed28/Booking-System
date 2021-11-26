import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom"
import * as Icons from "react-icons/fa"
import "./Navbar.css";
import { navItems } from './Navitems';
import Button from './Button';

const Navbar = () => {
    const navigate = useNavigate();
    let  routeChange = (path) => {
        navigate(`/${path}`);
    }
    const [loggedIn, setLoggedIn]= React.useState(false);
    const handleLogout = () => {
        // localStorage.clear();
        localStorage.removeItem("login-data");
        window.location.reload(false);
    }
    React.useEffect(() => {
            const data = localStorage.getItem("login-data");
            if(data){
                setLoggedIn(true);
             }
        },[])
    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-logo"><Icons.FaCalendarCheck/> Calendearly</Link>
                <ul className="nav-items">
                    {navItems.map(item => {
                        return (
                        <li key={item.id} className={item.cName}>
                            { loggedIn === false && item.title != "Statistics" &&
                                <Link to={"/Home"}>{item.title}</Link>
                            }
                            { (loggedIn === true || item.title === "Statistics") &&
                                <Link to={item.path}>{item.title}</Link>
                            }
                        </li>
                    )})}
                </ul>
                <div>
                    { loggedIn === false &&
                        <Button text="Sign Up" path="/Signup"/>
                    }
                    { loggedIn === false &&
                        <Button text="Sign In" path="/Home"/>
                    }
                    { loggedIn === true &&
                        <Button text="Logout" path="/Home" primary onClick={handleLogout}/>
                    }
                </div>
            </nav>
        </>
    );
}

export default Navbar
