import React, { useState, useEffect } from 'react';
import { db } from './firebase-config'; // Your Firebase configuration file
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function Selfie() {
    const [status, setStatus] = useState('Idle');
    const [userNumber, setUserNumber] = useState('');

    useEffect(() => {
        // Load the user number from localStorage when the component mounts
        const storedNumber = localStorage.getItem('userNumber');
        if (storedNumber) {
            setUserNumber(storedNumber);
        } else {
            setStatus('No user number found.');
        }
    }, []);

    const handleSendSelfie = async () => {
        if (!userNumber) {
            setStatus('No user number available.');
            return;
        }

        setStatus('Checking for VM instance...');
        try {
            const userDocRef = doc(db, 'users', userNumber);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data().vm_uuid) {
                setStatus(`VM Instance already exists: ${userDocSnap.data().vm_uuid}`);
            } else {
                setStatus('No VM instance found. Creating one...');
                // Call your server API to create a new instance here.
                const response = await fetch('/api/gmsaas/create-instance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userNumber: userNumber ,recipe:'flex' }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create VM instance.');
                }

                const data = await response.json();
                if (data.vm_uuid) {
                    // Update Firestore with the new vm_uuid
                    await updateDoc(userDocRef, {
                        vm_uuid: data.vm_uuid,
                    });
                    setStatus(`VM Instance created: ${data.vm_uuid}`);
                } else {
                    throw new Error('No VM UUID returned from the server.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="selfie-container">
            <h1>Selfie</h1>
            <button onClick={handleSendSelfie} disabled={!userNumber}>Send Selfie</button>
            <p>Status: {status}</p>
        </div>
    );
}

export default Selfie;
