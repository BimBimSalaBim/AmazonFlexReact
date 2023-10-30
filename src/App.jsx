import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import SideNav from './SideNav';
import Tabs from './Tabs';
import SearchBar from './SearchBar';
import CardContainer from './CardContainer';
import Profile from './Profile'; 
import Settings from './Settings'; 
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import './index.css'
import registerServiceWorker from 'react-service-worker';
registerServiceWorker();
function App() {
    const location = useLocation();

    return (
        <div>
            {location.pathname !== '/profile' && <NavBar />}
            <SideNav />
            <Routes>
                <Route path="/" element={
                    <>
                        {location.pathname !== '/profile' && <Tabs />}
                        {location.pathname !== '/profile' && <SearchBar />}
                        <CardContainer />
                    </>
                } />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                {/* Add more routes as needed */}
            </Routes>
            {/* More components or logic can be added here as needed */}
        </div>
    );
}

export default App;
