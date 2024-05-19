import React, { useState, useEffect } from 'react';
import Card from './Card';

function generateRandomData(count = 5) {
    // Mock data - Cities based on user's latitude and longitude
    const cities = ["Los Angeles", "Pasadena", "Santa Monica",  "Glendale", "San Pedro", "Bell", "Downey", "Culver City", "Compton"];
    const streets = ["Wilshire Blvd", "Sunset Blvd",  "Santa Monica Blvd", "Western Ave", "Normandy Ave", "Vermont Ave", "Slauson Ave", "Imperial Hwy"];
    
    const generatedData = [];
    const block = localStorage.getItem("block");
    const time = "12:01 AM - 10:59 PM";

    for (let i = 1; i <= count; i++) {
        // Create random address
        const randomStreetNumber = Math.floor(Math.random() * 1000) + 1;
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const randomStreetIndex = Math.floor(Math.random() * streets.length);

        const address = `${randomStreetNumber} ${streets[randomStreetIndex]}, ${cities[randomCityIndex]}`;

        const data = {
            address: address.toUpperCase(),
            scheduled: block + ' • Scheduled ' + time,
            isNext: i === 2,
            fistStop: i === 1,
            number: i,
            deliveryInfo: 'Deliver 1 package'
        };

        generatedData.push(data);
    }

    return generatedData;
}
function CardContainer() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        
        fetch('/api')
        .then(response => response.json())
        .then(data => console.log(data));
        setCards(generateRandomData(10));
    }, []);

    return (
        <div className="container" style={{margin: '0 5vw'}}>
            <div id="card-container">
                {cards.map((cardData, index) => (
                    <Card key={index} data={cardData} />
                ))}
            </div>
        </div>
    );
}

export default CardContainer;
