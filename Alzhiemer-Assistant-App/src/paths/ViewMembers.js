import React, { useEffect, useState } from 'react';
import SOSButton from './SOSbutton.js';
import "../App.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Whatsapp from '../photos/whatsapp.png'

export default function ViewMembers() {
    const [familyMembers, setFamilyMembers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/family')
            .then(response => {
                setFamilyMembers(response.data);
            })
            .catch(error => {
                console.error('Error fetching family members:', error);
            });
    }, []);

    const openMessageModal = (member) => {
        const message = prompt(`Type your message for ${member.name}:`);
        if (message) {
            sendMessage(member.phone, message);
        }
    };

    const sendMessage = (phone, message) => {
        axios.post('http://localhost:3001/api/send-message', {
            phone: phone,
            message: message,
        })
        .then(response => {
            alert('Message sent successfully!');
        })
        .catch(error => {
            alert('Error sending message');
            console.error(error);
        });
    };

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
                <Link to="/family">This Page</Link>
            </div>
            <h1>Family Members</h1>
            <Link to="/recognize">Click Here to Identify Someone</Link><br /><br />
            <table className='table-schedule'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Information</th>
                    </tr>
                </thead>
                <tbody>
                    {familyMembers.length > 0 ? (
                        familyMembers.map(member => {
                            let src = require(`../known/${member.name}.png`);

                            return (
                                <tr key={member._id}>
                                    <td>
                                        <img src={src} alt='Not Found' className='family-table-img' />
                                        <br />
                                        <p>{member.name}</p>
                                    </td>
                                    <td>
                                        <p>Relation : {member.relation}</p>
                                    
                                        <p onClick={() => openMessageModal(member)} style={{cursor:'pointer',fontSize:'20px'}}><img src={Whatsapp} alt="Whatsapp Message" style={{width:'22px'}}/>{member.phone}</p>
                                    </td>
                                </tr>
                                
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4">No family members found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className='links-container'>
                <Link to="/">Home</Link><br />
                <Link to="/schedule">View Schedule</Link>
            </div>
        </div>
        </>
    );
}