import React, { useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
function NavBar() {
    useEffect(() => {
        const elems = document.querySelectorAll('.sidenav');
        const instances = M.Sidenav.init(elems);
    }, []);
    return (
        <nav className="grey darken-4">
            <div className="nav-wrapper">
            <ul id="nav-mobile" className="left">
                <li><a href="#" data-target="slide-out" className="sidenav-trigger show-on-large"><i className="material-icons">menu</i></a></li> 
            </ul>
                <a href="#" className="brand-logo center" style={{fontFamily: "Arial", fontSize: "12pt", fontWeight: "bold"}}>ITINERARY</a>
                <ul id="nav-mobile" className="right">
                    <li><a href="#"><i className="material-icons">chat_bubble_outline</i></a></li>
                    <li><a href="#"><i className="material-icons">help_outline</i></a></li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
