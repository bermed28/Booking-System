import React from 'react'
import {Link} from "react-router-dom"
import "./Button.css"


const Button = ({text}) => {
    return (
        <Link to="sign-up">
            <button className="btn">{text}</button>
        </Link>
    );
}

export default Button;