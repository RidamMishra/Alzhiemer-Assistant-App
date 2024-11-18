import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SOSButton from './SOSbutton';

function App() {
  let videoRef = useRef(null);
  let photoRef = useRef(null);

  const getUserCamera = () => {
    navigator.mediaDevices.getUserMedia({
      video: true
    })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.log("Error accessing camera: ", error);
      });
  };

  useEffect(() => {
    getUserCamera();
  }, [videoRef]);

  const takePhoto = () => {
    let width = 500;
    let height = width / (16 / 9);
    let photo = photoRef.current;
    let video = videoRef.current;
    photo.width = width;
    photo.height = height;
    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, photo.width, photo.height);

    const imageData = photo.toDataURL('image/png');

    fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            let name=data.match.split('.')[0];
            axios.post('http://localhost:3001/details',{name},{withCredentials:true})
            .then(res=>{
              alert(`Photo taken is of ${res.data.name}, who is your ${res.data.relation}. Contact Number: ${res.data.phone}`)
            })
        }
    })
    .catch(error => {
        alert(error);
    });
  }

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
          <Link to="/family">Family Members</Link>
          <span> &gt; </span>
          <Link to="/recognize">This page</Link>
      </div>
      <h1>Take a Picture</h1>
      <video ref={videoRef} style={{ width: '80%', height: 'auto' }}></video>
      <div>
        <button onClick={takePhoto} className='login-button'>Identify</button>
      </div>
      <canvas ref={photoRef} style={{ display: 'none' }}></canvas>
      <br /><br />
      <div className='links-container'>
          <Link to="/">Home</Link><br />
          <Link to="/family">Go Back</Link>
      </div>
    </div>
    </>
  );
}

export default App;