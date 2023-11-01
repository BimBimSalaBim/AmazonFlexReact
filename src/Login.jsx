import React, { useState, useRef,useEffect } from 'react';
import { auth,db } from './firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { collection, setDoc,getDocs, where,query,doc  } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


const LoginPage = ({ setIsLoggedIn }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationPhase, setIsVerificationPhase] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const recaptchaVerifierRef = useRef(null);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchPost = () => {
      const Doc = query(collection(db, "Users"),where("Number", "==", formatPhoneNumber(phoneNumber)));
      setLoading(true);
      getDocs(Doc)
          .then((querySnapshot)=>{               
              const newData = querySnapshot.docs
                  .map((doc) => ({...doc.data(), id:doc.id }));
                console.log(newData);
              if(newData.length === 0){
                setIsSignupMode(true);
                console.log("No data");
                setLoading(false);
                return false;
              }
              else{
                localStorage.setItem('userName', newData[0].Name);
                localStorage.setItem('userPic', newData[0].Pic);
                localStorage.setItem('userNumber', newData[0].Number)
                localStorage.setItem('RouteLimit', newData[0].RouteLimit);
                setIsSignupMode(false);
                console.log("Data found 1");
                setLoading(false);
                localStorage.setItem('isLoggedIn', 'true');
                return true;
              }

          })
          if(localStorage.getItem('userName') === null){
            return false;
          }
          else{
            return true;
          }
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

    const handleInputChange = (event) => {
        if (!isVerificationPhase) {
            setPhoneNumber(event.target.value);
        } else {
            setVerificationCode(event.target.value);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(file);
        }
    };
  
    
const delay = ms => new Promise(res => setTimeout(res, ms));

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
        const storage = getStorage();
        const storageRef = ref(storage, 'profilePictures/' + phoneNumber); // 'profilePictures/' is a folder in Firebase Storage
        const snapshot = await uploadBytesResumable(storageRef, profilePic);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("File uploaded successfully!", downloadURL);

        await setDoc(doc(db, "Users", phoneNumber), {
            Name: fullName,
            Number: phoneNumber,
            Pic: downloadURL,
            RouteLimit:5
        });
        await fetchPost();
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.reload();
    } catch (error) {
        console.error("Error:", error);
    }
};

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isVerificationPhase) {
            try {
              setPhoneNumber(formatPhoneNumber(phoneNumber));
                const appVerifier = new RecaptchaVerifier(recaptchaVerifierRef.current, {
                    size: 'invisible',
                    codeTime: 60000
                }, auth);
                const result = await signInWithPhoneNumber(auth, formatPhoneNumber(phoneNumber), appVerifier);
                console.log(result)
                setConfirmationResult(result);
                setIsVerificationPhase(true);
  
            } catch (error) {
                console.error("Error sending verification code", error);
            }
        } else {
            try {
                await confirmationResult.confirm(verificationCode);
                // ;  // Switch to signup mode after verification
                
                const logged = await fetchPost();
                console.log(logged);
                // while(loading){
                //   console.log("loading");
                //   return new Promise(resolve => setTimeout(resolve, 1));
                // }
                console.log(loading)
                while(localStorage.getItem('userName') === null){
await delay(1000);
                    fetchPost();}
                
                console.log("Phone number verified!");
                fetchPost();
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
                // window.location.reload()
                  
                

                // setIsLoggedIn(true);  // Set user as logged in
            } catch (error) {
                console.error("Error verifying the code", error);
            }
        }
    };

    return (
        <div className="login-page-container">
            <h1 className="center-align login-logo">BlockBot.app</h1>
            <div ref={recaptchaVerifierRef}></div> 

            {isSignupMode ? (
                <div className="row">
                    <form className="col s12" onSubmit={handleSignup}>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="file-field input-field col s12">
                                <div className="btn">
                                    <span>Upload</span>
                                    <input type="file" onChange={handleFileChange} accept="image/*" />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" placeholder="Upload Profile Picture" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <button className="btn waves-effect waves-light submit-btn" type="submit">
                                    Complete Signup
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="row">
                    <form className="col s12" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    type={!isVerificationPhase ? "tel" : "text"} 
                                    id={!isVerificationPhase ? "phoneNumber" : "verificationCode"}
                                    name={!isVerificationPhase ? "phoneNumber" : "verificationCode"}
                                    value={!isVerificationPhase ? phoneNumber : verificationCode}
                                    onChange={handleInputChange} 
                                    className="validate phone-input"
                                    placeholder={!isVerificationPhase ? "Enter Phone Number" : "Enter Verification Code"}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <button className="btn waves-effect waves-light submit-btn" type="submit">
                                    {!isVerificationPhase ? "Send Verification Code" : "Verify Code"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
