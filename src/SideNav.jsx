import React, { useEffect, useRef,useState } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import profilePic from './assets/selfi.jpeg';
import { Link } from 'react-router-dom';

function SideNav() {
    const sidenavRef = useRef(null);
    const [userName, setUserName] = useState(sessionStorage.getItem('userName') || 'Default Name');
    
    useEffect(() => {
        M.Sidenav.init(sidenavRef.current);
        const updateUserName = () => {
            setUserName(sessionStorage.getItem('userName') || 'Default Name');
        };

        // Add event listener to listen for storage changes
        window.addEventListener('storage', updateUserName);

        // Cleanup: remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('storage', updateUserName);
        };
    }, []);

    const closeSidenav = () => {
        const instance = M.Sidenav.getInstance(sidenavRef.current);
        if (instance) {
            instance.close();
        }
    };

    return (
        <ul ref={sidenavRef} id="slide-out" className="sidenav grey darken-4 white-text">
            <li>
                <div className="close-btn">
                    <a href="#!" className="close-sidenav" onClick={closeSidenav}>&times;</a>
                </div>
            </li>
            <li>
                <div className="profile">
                <Link to="/profile" onClick={closeSidenav} style={{ border: 'none' }}>
                    <img src={profilePic} alt="Ahmed Ali" />
                </Link>

                    {/* <img src={profilePic} alt="Ahmed Ali" /> */}
                    <div id="profile-name" className="profile-name">{userName}</div>
                </div>
            </li>
            
            {/* <li><a href="#!">Current stop</a></li> */}
            <li><Link to="/" onClick={closeSidenav}>Current stop</Link></li>
            <li><a href="#!">Today's itinerary</a></li>
            <li><a href="#!">Pick up</a></li>
            <li><a href="#!">Updates</a></li>
            <li><a href="#!">Schedule</a></li>
            <li><a href="#!">Offers</a></li>
            <li><Link to="/profile" onClick={closeSidenav}>Your Dashboard</Link></li>
            <li><Link to="/settings" onClick={closeSidenav}>Settings</Link></li>
            <li><a href="#!">Calendar</a></li>
            <li><a href="#!">Earnings</a></li>
            <li><a href="#!">Healthcare Subsidy</a></li>
            <li><a href="#!" className="driver-support"><i className="material-icons">phone</i> Driver Support</a></li>
            <li><a href="#!" className="emergency-help"><i className="material-icons">warning</i> Emergency Help</a></li>
        </ul>
    );
}

export default SideNav;
