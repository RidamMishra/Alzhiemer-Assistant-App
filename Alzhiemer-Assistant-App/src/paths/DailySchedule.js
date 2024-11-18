import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css";
import { Link } from 'react-router-dom';
import SOSButton from './SOSbutton';

export default function DailySchedule() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/display')
            .then(result => {
                const sortedSchedule = result.data.sort((a, b) => {
                    return new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`);
                });
                setSchedule(sortedSchedule);
            })
            .catch(error => {
                console.error("Error fetching schedule:", error);
            });
    }, []);

    return (
        <>
        <div>
            <SOSButton/>
        </div>
        <div className='main-div'>
            <div className='header'>
                <h1 style={{color:'purple'}}>Your Alzheimer's Assistant</h1>
                <h3>Stay connected to your loved ones</h3>
                <Link to="/">Home</Link>
                <span> &gt; </span>
                <Link to="/schedule">This Page</Link>
            </div>
            <div>
                <h1>Your Daily Schedule</h1>
                <table className='table-schedule'>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((s, index) => (
                            <tr key={index}>
                                <td>{s.time}</td>
                                <td>{s.task}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='links-container'>
                <Link to="/">Home</Link><br />
                <Link to="/family">View Family Members</Link>
            </div>
        </div>
        </>
    );
}