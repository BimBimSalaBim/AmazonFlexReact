import React, { useState } from 'react';
import barcodeImage from './assets/barcode.png';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            sessionStorage.setItem("block", inputValue);
            window.location.reload(); // Refresh the page
        }
    };

    return (
        <div className="search-bar-container">
            <i className="material-icons prefix refresh-icon white-text">refresh</i>
            <div className="search-bar">
                <i className="material-icons prefix search-icon white-text">search</i>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{borderBottom: 'none', boxShadow: 'none', margin: 0, color:'white'}}
                    placeholder="Search by tracking ID"
                />
                <img src={barcodeImage} alt="Barcode" className="barcode-icon" />
            </div>
        </div>
    );
}

export default SearchBar;
