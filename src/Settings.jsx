import React, { useState } from 'react';

function Settings() {
    // 1. Create state variables
    const [name, setName] = useState(sessionStorage.getItem("userName") || "");
    const [profilePic, setProfilePic] = useState(sessionStorage.getItem("profilePic") || "");
    const [stationAddress, setStationAddress] = useState(sessionStorage.getItem("stationAdd") || "");
    const [city, setCity] = useState("");  // Assuming you don't have a city in sessionStorage yet

    const handleSubmit = (e) => {
        e.preventDefault();

        // Update session storage
        sessionStorage.setItem("userName", name);
        sessionStorage.setItem("profilePic", profilePic);


        sessionStorage.setItem('stationAdd', stationAddress);
        sessionStorage.setItem('stationCity', city);
        alert('Settings updated successfully!');
    }

    return (
        <div className="container">
            <h5>Settings</h5>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
                    <label htmlFor="name">Name</label>
                </div>

                <div className="input-field">
                    <input type="text" id="profilePic" value={profilePic} onChange={e => setProfilePic(e.target.value)} />
                    <label htmlFor="profilePic">Profile Pic URL</label>
                </div>

                <div className="input-field">
                    <input type="text" id="stationAddress" value={stationAddress} onChange={e => setStationAddress(e.target.value)} />
                    <label htmlFor="stationAddress">Station Street Address</label>
                </div>

                <div className="input-field">
                    <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} />
                    <label htmlFor="city">Station City</label>
                </div>

                <button className="btn waves-effect waves-light" type="submit">
                    Update Settings
                </button>
            </form>
        </div>
    );
}

export default Settings;
