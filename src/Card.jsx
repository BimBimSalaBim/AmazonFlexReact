// Card.js
import React, { useState, useEffect } from 'react';

function Card({ data }) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    const formattedMinute = minutes.toString().padStart(2, '0');
    const [station, setStation] = useState(localStorage.getItem('stationAdd') || 'Default Address');
    const [stationCity, setStationCity] = useState(localStorage.getItem('stationCity') || 'Default City');

    useEffect(() => {
        // This function updates the userName from sessionStorage
        const updateStation = () => {
            setStation(localStorage.getItem('stationAdd').toUpperCase() || 'ADDRESS');
            setStationCity(localStorage.getItem('stationCity').toUpperCase() || 'CITY');
        };

        // Add event listener to listen for storage changes
        window.addEventListener('storage', updateStation);

        // Cleanup: remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('storage', updateStation);
        };
    }, []); 
    return (
        <div className="card-panel white-text">
            <div className="row" style={{ margin: "0 -45px", zIndex: 3, position: "relative" }}>
                <div className="col s1">
                    <div className={data.isNext ? "pin first" : "pin"}>
                        <div className="pin-label">{data.number}</div>
                    </div>
                </div>
                <div className="col s11" style={{ marginTop: "-35px" }}>
                    {data.fistStop && (
                        <>
                            <p className="scheduled-text" style={{ fontSize: "1.2rem" }}>
                                Picked up at {formattedHour}:{formattedMinute} {ampm}
                            </p>
                            <p className="random-address">{station.toUpperCase()}<br />{stationCity.toUpperCase()}</p>
                        </>
                    )}
                    {data.isNext && (
                        <>
                            <p style={{ color: "#34811a" }}>Next Stop:</p>
                            <p className="scheduled-text" style={{ fontSize: "1.2rem" }}>
                                <i className="material-icons blue-text" style={{ fontSize: "1.2rem", marginRight: "5px" }}>schedule</i>
                                {data.scheduled}
                            </p>
                            <p className="random-address">{data.address.split(',')[0]}<br/>{data.address.split(',')[1]}</p>
                            <p className="delivery-info" style={{ fontSize: "1.rem" }}>{data.deliveryInfo}</p>
                        </>
                    )}
                    {!data.fistStop && !data.isNext && (
                        <>
                            <p className="scheduled-text" style={{ fontSize: "1.2rem" }}>
                                <i className="material-icons blue-text" style={{ fontSize: "1.2rem", marginRight: "5px" }}>schedule</i>
                                {data.scheduled}
                            </p>
                            <p className="random-address">{data.address.split(',')[0]}<br/>{data.address.split(',')[1]}</p>
                            <p className="delivery-info" style={{ fontSize: "1.rem" }}>{data.deliveryInfo}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;
