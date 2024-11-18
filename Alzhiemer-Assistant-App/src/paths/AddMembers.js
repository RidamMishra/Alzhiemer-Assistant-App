import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function App() {
  let [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rel, setRel] = useState('');
  const videoRef = useRef(null);
  const photoRef = useRef(null);

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
    if (name === '' || rel==='') {
      alert('Please fill in your name and relation');
      return;
    }
    let width = 500;
    let height = width / (16 / 9);
    let photo = photoRef.current;
    let video = videoRef.current;
    photo.width = width;
    photo.height = height;
    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, photo.width, photo.height);

    const imageData = photo.toDataURL('image/png');
    name=name.toUpperCase();

    fetch('http://localhost:5000/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData, name: name })
    })
    .then(response => response.json())
    .then(data => {
      axios.post('http://localhost:3001/addmem',{name,rel,phone},{withCredentials:true})
      .then(result=>{
        alert(result.data);
      });
    })
    .catch(error => {
      alert(error);
    });
  };

  return (
    <div className='main-div'>
      <div className='header'>
          <h1 style={{color:'purple'}}>Your Alzheimer's Assistant</h1>
          <h3>Stay connected to your loved ones</h3>
          <Link to="/loginhome">Home</Link>
          <span> &gt; </span>
          <Link to="/addmem">This Page</Link>
      </div>
      <h1>Click your Photo !</h1>
      <video ref={videoRef} style={{ width: '80%', height: 'auto' }}></video>
      <br /><br />
      <input className='login-input' type='text' placeholder='Enter name' onChange={(e) => { setName(e.target.value) }} />< br/>< br/>
      <input type='text' className='login-input' placeholder='Enter relation' onChange={(e) => { setRel(e.target.value) }} />< br/>< br/>
      <input type='text' className='login-input' placeholder='Enter phone no.' onChange={(e) => { setPhone(e.target.value) }} />< br/>< br/>
      <div>
        <button onClick={takePhoto} className='login-button'>Add to Family and Friends</button>
      </div>
      <canvas ref={photoRef} style={{ display: 'none' }}></canvas>
      <br /><br />
      <div className='links-container'>
          <Link to="/loginhome">Home</Link><br />
          <Link to="/makechange">Edit Schedule</Link>
      </div>
    </div>
  );
}

export default App;