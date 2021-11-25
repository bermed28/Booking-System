import React from 'react'
import {Link} from "react-router-dom"
import "./Button.css"


const Button = ({text, path, onClick}) => {
    return (
        <Link to={path}>
            <button className="btn" onClick={onClick}>{text}</button>
        </Link>
    );
}

export default Button;