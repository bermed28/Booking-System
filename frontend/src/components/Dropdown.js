import React, {useState} from 'react'
import { statsDropdown } from './Navitems'
import {Link} from "react-router-dom"
import "./Dropdown.css"
import { Item } from 'semantic-ui-react'

const Dropdown = () => {
    const [dropdown, setDropdown] = useState(false);

    return (
        <>
            <ul className="stats-submenu">
                {statsDropdown.map(item => {
                    return (
                    <li key={item.id}>
                        <Link to={item.path} className={item.cName}>
                            {item.title}
                        </Link>
                    </li>)
                })}
            </ul>
        </>
    )
}

export default Dropdown
