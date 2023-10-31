// Profile.jsx

import React, { useState, useEffect } from 'react';
// import './index.css'; // Adjust the path to your CSS file if it's different
import profilePic from './assets/selfi.jpeg';
import logo from './assets/amazonlogo.png';
import backgroundImage from './assets/bg.jfif';  // Adjust the path accordingly
import { Link } from 'react-router-dom';
function ProfileHeader() {
    const openSidenav = () => {
        const sidenavRef = useRef(null);
        const instance = M.Sidenav.getInstance(sidenavRef.current);
        if (instance) {
            instance.open();
        }
    };
    return (
        <header className="profile-header">
            <div></div>
            <div className="amazon-logo">
                <img src={logo} alt="Amazon Logo" />
            </div>
            <Link to="/" onClick={openSidenav} style={{ border: 'none' }}>
            <div className="profile-close-btn">
                <a  className="close-sidenav">×</a>
            </div>
                </Link>
            
        </header>
    );
}

function ProfileMain() {


    const [dateTime, setDateTime] = useState('');
    const [userName, setUserName] = useState(sessionStorage.getItem('userName') || 'Default Name');
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const month = months[now.getMonth()];
            const day = now.getDate();
            const year = now.getFullYear();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";

            const formattedHour = hours % 12 || 12;
            const formattedMinute = minutes.toString().padStart(2, '0');
            const formattedDateTime = `${month} ${day} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`;

            setDateTime(formattedDateTime);
        };
        const updateUserName = () => {
            setUserName(sessionStorage.getItem('userName') || 'Default Name');
        };

        // Add event listener to listen for storage changes
        window.addEventListener('storage', updateUserName);
        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', updateUserName);
        }// Clean up the interval on unmount
    }, []);

    return (
            <main className="profile-main" style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8)), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            backgroundRepeat: 'no-repeat',
            height: '80vh'  // This ensures the background image covers the full viewport height
            }}>
            <div className="profile-pic">
                <img src={localStorage.getItem("userPic")} alt="ProfilePic" />
            </div>
            <div className="profile-content">
                <div id="profile-name" className="profile-page-name" style={{ color: 'black' }}>{localStorage.getItem("userName")}</div>
                <div className="on-duty">
                    <h6>ON DUTY</h6>
                </div>
                <div id="datetime" style={{ color: 'black' }}>{dateTime}</div>
            </div>
        </main>
    );
}

function ProfileFooter() {
    return (
        <div className="profile-footer">
            <h6 style={{ fontSize: '16px', color: 'black' }}>TODAY'S ITINERARY</h6>
            <i className="material-icons" style={{ color: 'black' }}>chevron_right</i>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <div>
            <ProfileHeader />
            <ProfileMain />
            <ProfileFooter />
        </div>
    );
}
