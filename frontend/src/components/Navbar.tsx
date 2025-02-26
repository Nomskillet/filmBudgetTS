import React from "react";
import "../styles/Navbar.css"


const Navbar : React.FC= () => {
    return (
        <nav className="Navbar">
            <h1>FILM BUDGET TRACKER</h1>
            <ul>
                <li><a href="/">Dashboard</a></li>
            </ul>
        </nav>
    )
}

export default Navbar