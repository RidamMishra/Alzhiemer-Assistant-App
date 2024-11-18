import SOS_image from '../photos/sos.jpg';
import React from 'react';
import axios from 'axios';

const SOSButton = () => {
    const sendSOSMessage = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                axios.post('http://localhost:3001/api/send-sos', { latitude, longitude })
                    .then(response => {
                        if (response.data.success) {
                            alert('SOS message sent successfully with location!');
                        } else {
                            alert('Failed to send SOS message.');
                        }
                    })
                    .catch(error => {
                        alert('Error sending SOS message');
                        console.error(error);
                    });
            }, () => {
                alert('Unable to retrieve location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    return (
        <img onClick={sendSOSMessage} alt='Click to Send SOS Signal' src={SOS_image} className='sos-image'/>
    );
};

export default SOSButton;
