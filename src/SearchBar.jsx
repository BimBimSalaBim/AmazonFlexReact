import React, { useState } from 'react';
import barcodeImage from './assets/barcode.png';
import { auth, db } from './firebase-config';
import { collection, setDoc, getDocs, where, query, doc } from 'firebase/firestore';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const formatPhoneNumber = (input) => {
        // If already in the +1 format
        if (input.startsWith("+1") && input.length === 12) {
            return input;
        }
    
        // Remove all non-numeric characters
        const numeric = input.replace(/\D/g, '');
    
        // Prepend the +1 country code
        return `+1${numeric}`;
    };
    const handleKeyDown = async (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            
            // Fetch RouteLimit from Firebase Firestore
            const q =  query(collection(db, "Users"),where("Number", "==", formatPhoneNumber(localStorage.getItem('userNumber'))));
            const querySnapshot = await getDocs(q);
            
            // Assuming RouteLimit is in the first document of the results:
            const routeLimit = querySnapshot.docs[0].data().RouteLimit;
            
            if (routeLimit <= 0) {
                alert("Route limit exceeded!");
                // M.toast({html: 'Payment Complete!'});
                return;
            }
            // Update RouteLimit in Firebase Firestore
            const userRef = doc(db, "Users", formatPhoneNumber(localStorage.getItem('userNumber')));
            await setDoc(userRef, {
                RouteLimit: routeLimit - 1
            }, { merge: true });
            localStorage.setItem("routeLimit", routeLimit - 1);
            localStorage.setItem("block", inputValue);
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
