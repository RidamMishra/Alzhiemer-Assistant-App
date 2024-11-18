import React from 'react';
import { Link } from 'react-router-dom';
import SOSButton from "./paths/SOSbutton.js";
export default function Home() {
    return (
        <>
        <div>
            <SOSButton/>
        </div>  
        <div className='main-div-img'>
            <div className='image-bg'>
            <div className='links-container'>
                <Link to="/schedule">Today's Schedule</Link><br />
                <Link to="/family">View Family Members</Link><br />
                <Link to="/edit" className='links-edit'>Edit Schedule and Family Members</Link>
            </div>
            </div>
        </div>
        </>
    );
}