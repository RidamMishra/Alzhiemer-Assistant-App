import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeLogin() {
    return (
        <div className='main-div-img'>
            <div className='image-bg'>
            <div className='links-container'>
                <Link to="/makeChange">Edit Schedule</Link><br />
                <Link to="/addmem">Add Family Members</Link><br />
                <Link to="/edit" className='links-edit'>Logout</Link>
            </div>
            </div>
        </div>
    );
}