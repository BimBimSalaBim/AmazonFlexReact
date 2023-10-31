import React, { useState, useContext, createContext,useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import SideNav from './SideNav';
import Tabs from './Tabs';
import SearchBar from './SearchBar';
import CardContainer from './CardContainer';
import Profile from './Profile'; 
import Settings from './Settings'; 
import LoginPage from './Login';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import './index.css'
import registerServiceWorker from 'react-service-worker';

// Create AuthContext
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

function App() {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initially set to false
    useEffect(() => {
        const savedLoginState = localStorage.getItem('isLoggedIn');
        if (savedLoginState === 'true') {
            setIsLoggedIn(true);
        }
    }, []);  
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <div>

                <Routes>
                    <Route path="/" element={
                        <>
                            {isLoggedIn ? (
                                <>
                                    {location.pathname !== '/profile' && <NavBar />}
                                    <SideNav />
                                    {location.pathname !== '/profile' && location.pathname !== '/settings'&&<Tabs />}
                                    {location.pathname !== '/profile' && location.pathname !== '/settings'&& <SearchBar />}
                                    {location.pathname !== '/profile' && location.pathname !== '/settings'&& <CardContainer />}
                                    {location.pathname === '/settings'&&<Settings />}
                                </>
                            ) : (
                                <LoginPage setIsLoggedIn={setIsLoggedIn} />
                            )}
                        </>
                    } />
                    <Route path="/profile" element={
                                                <>
                                                {isLoggedIn ? (
                                                    <>
                                                    <Profile />
                                                    </>
                                                ) : (
                                                    <LoginPage setIsLoggedIn={setIsLoggedIn} />
                                                )}
                                            </>
                   
                }/>
                    <Route path="/settings" element={
                        <>
                        {isLoggedIn ? (
                            <>      
                            {location.pathname !== '/profile' && <NavBar />}
                            <SideNav />
                            <Settings />
                            </>
                        ) : (
                            <LoginPage setIsLoggedIn={setIsLoggedIn} />
                        )}
                    </>
                } />
                    {/* Add more routes as needed */}
                </Routes>
                {/* More components or logic can be added here as needed */}
            </div>
        </AuthContext.Provider>
    );
}

registerServiceWorker();

export default App;
