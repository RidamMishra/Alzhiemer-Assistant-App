import React from 'react';
import "../App.css";
import {Link} from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DailySchedule(){
    const [formData, setFormData] = useState({
        email:"",
        password:""
    });

    const [res, setRes]=useState('');
    const navigate=useNavigate();

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
        axios.post('http://localhost:3001/login',formData,{withCredentials:true})
        .then(result=>{
            if(result.data==='0'){
                setRes('Profile not found!');
            }
            else if(result.data==='1'){
                setRes('Incorrect Password')
            }
            else{
                setRes('Login sucessful');
                navigate('/loginhome')
            }
        })  
    }
    return(
        <div className='main-div'>
            <div>
                <h1>Family Member Login</h1>
                <form onSubmit={handleSubmit} className='login-form'>
                    <label>Email: </label><input type="text" name="email" className='login-input' placeholder="Enter your Email" value={formData.email} onChange={handleChange} required/><br/><br/>
                    <label>Password: </label><input type="password" name="password" className='login-input' placeholder="Enter your Password" value={formData.password} onChange={handleChange} required/><br/><br/>
                    <button type="submit" className='login-button'>Login</button><br/><br/>
                    <p style={{color:'red',fontWeight:'bold', display:res==='' ? 'none':'block'}}>{res}</p>
                </form>
                
            </div>
            <div className='links-container'>
                <Link to="/">Home</Link><br />
            </div>

        </div>
    )
}