import React from 'react'
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
        localStorage.removeItem("login-data");
        if(window.location.pathname === "/"){
            window.location.reload(false);
        }
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
                                { loggedIn === false && item.title !== "Statistics" && item.title !== "Home" &&
                                <Link to={"/Login"}>{item.title}</Link>
                                }
                                { (loggedIn === true || item.title === "Statistics" || item.title === "Home") &&
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
                    <Button text="Sign In" path="/Login"/>
                    }
                    { loggedIn === true &&
                    <Button text="Logout" path="/" primary onClick={handleLogout}/>
                    }
                    { loggedIn === true &&
                    <Button text="Settings" path="/Settings"/>
                    }
                </div>
            </nav>
        </>
    );
}

export default Navbar
