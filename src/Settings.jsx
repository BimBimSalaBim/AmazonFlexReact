import React, { useState,useEffect } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { auth, db } from './firebase-config';
import { collection, setDoc, getDocs, where, query, doc } from 'firebase/firestore';


function Settings() {
    // 1. Create state variables
    const [name, setName] = useState(localStorage.getItem("userName") || "");
    const [stationAddress, setStationAddress] = useState(localStorage.getItem("stationAdd") || "");
    const [city, setCity] = useState("");  // Assuming you don't have a city in sessionStorage yet
    const [RouteLimit, setRouteLimit] = useState(null);

    // payment
    // const [showToast, setShowToast] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePaymentSuccess = () => {
        setIsModalOpen(false);  // Close the modal
        console.log('Closing modal');
        // Use Materialize CSS to show the toast
        M.toast({html: 'Payment Complete!'});
    };



    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Update session storage
        localStorage.setItem("userName", name);
        localStorage.setItem('stationAdd', stationAddress);
        localStorage.setItem('stationCity', city);
        alert('Settings updated successfully!');
    }
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
    useEffect(() => {
        async function fetchRouteLimit() {
            // Modify the query as per your Firestore collection's structure
            const q = query(collection(db, "Users"), where("Number", "==", formatPhoneNumber(localStorage.getItem('userNumber'))));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const RouteLimitValue = querySnapshot.docs[0].data().RouteLimit;
                console.log(RouteLimitValue);
                setRouteLimit(RouteLimitValue);
            } else {
                console.error("No documents found for the given criteria.");
            }
        }
        fetchRouteLimit();
    }, []);

    return (
        <div className="settings-container">
            <h5>Settings</h5>
            <h6>Route Limit: {RouteLimit ? RouteLimit : "Fetching..."}</h6>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
                    <label htmlFor="name">Name</label>
                </div>

                <div className="input-field">
                    <input type="text" id="stationAddress" value={stationAddress} onChange={e => setStationAddress(e.target.value)} />
                    <label htmlFor="stationAddress">Station Street Address</label>
                </div>

                <div className="input-field">
                    <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} />
                    <label htmlFor="city">Station City</label>
                </div>

                <button className="btn waves-effect waves-light submit-btn" type="submit">
                    Update Settings
                </button>

            </form>
            <button className="btn waves-effect waves-light submit-btn" onClick={handleOpenModal}>Buy More Credits</button>
            
            
            
            {isModalOpen && 
                <Modal onClose={handleCloseModal}>
                    <StripePurchaseButton onPaymentSuccess={handlePaymentSuccess} />
                </Modal>
            }
        </div>
    );
}

function Modal({ children, onClose }) {
    return (
        <div className="modal-background">
            <div className="modal-content">
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

function StripePurchaseButton({ onPaymentSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [creditQuantity, setCreditQuantity] = useState(1);  // Default to 1 credit
    const [loading, setLoading] = useState(false);

    const CREDIT_VALUE = 0.75;  // Set this to the value of one credit

    const totalAmount = creditQuantity * CREDIT_VALUE; // Calculate the total amount

    const handlePurchase = async () => {
        // Step 1: Call your backend to create a PaymentIntent
        setLoading(true); // Start loading
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ amount: (totalAmount*100),email:localStorage.getItem('userName')+"@blockbot.app",name:localStorage.getItem('userName'),number:localStorage.getItem('userNumber') }),
            headers: { 'Content-Type': 'application/json' }
        });
        // Handle non-ok responses (this will catch any responses with a status code outside of the 200-299 range)
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating payment intent:", errorData);
            return;
        }
    
        const data = await response.json();
    
        // Step 2: Confirm the PaymentIntent with the card details
        const result = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });
    
        if (result.error) {
            console.log(result.error.message);
M.toast({html:result.error.message});
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment successful!');
                const number = localStorage.getItem('userNumber');
                fetch('/api/update-user-data', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ number, "RouteLimit":creditQuantity })
                  })
                  .then(response => response.json())
                  .then(data => {
                        console.log("Received data from backend:", data);  // Handle the response from your server
                        if(data.message === "Data updated successfully"){
                            console.log("User data updated successfully. Calling onPaymentSuccess."); // Add this
                            localStorage.setItem('RouteLimit', parseInt(localStorage.getItem('RouteLimit')) + creditQuantity);
                            onPaymentSuccess();
                            window.location.reload()
                        }
                  })
                  .catch(error => {
                    console.error("Error while updating user data:", error);
M.toast({html:error});    
              });

            }
        }
        setLoading(false); // Stop loading
    };

    return (
        <div>
            <div className="input-field" style={{ marginBottom: '20px',marginTop: '-8px' }}>
                <label style={{ color: 'black', display: 'block', marginBottom: '10px' }}>
                    How many credits do you want to buy?
                </label>
                <input 
                    type="number" 
                    value={creditQuantity} 
                    onChange={e => setCreditQuantity(Math.max(1, e.target.value))}
                    min="1"
                    style={{
                        color: 'black', 
                        padding: '10px', 
                        width: '80%', 
                        fontSize: '16px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px'
                    }}
                />
            </div>
            <p style={{ color: 'black', fontSize: '18px' }}>
                Total Price: ${totalAmount}
            </p>  
            <CardElement />
            {loading ? (
            <div className="spinner"></div>
        ) : (
            <button onClick={handlePurchase}>Buy Now</button>
        )}
        </div>
    );
}


export default Settings;
