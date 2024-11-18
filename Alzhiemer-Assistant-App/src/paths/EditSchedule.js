import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Update() {
    const [activity, setActivity] = useState('');
    const [time, setTime] = useState('');
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

    function handleClick() {
        if (time === '' || activity === '') {
            alert('Please enter time and activity');
        } else {
            axios.post('http://localhost:3001/add', { time, activity }, { withCredentials: true })
                .then(result => {
                    alert(result.data);
                    setSchedule(prevSchedule => [...prevSchedule, {time,task:activity}]);
                    setTime('');
                    setActivity('');
                })
        }
    }

    function handleDelete(time, task) {
        axios.post('http://localhost:3001/delete', { time, task }, { withCredentials: true })
            .then(res => {
                alert(res.data);
                setSchedule(schedule.filter(s => !(s.time === time && s.task === task)));
            })
            .catch(error => {
                console.error("Error deleting task:", error);
            });
    }

    return (
        <div className='main-div'>
            <div className='header'>
                <h1 style={{color:'purple'}}>Your Alzheimer's Assistant</h1>
                <h3>Stay connected to your loved ones</h3>
                <Link to="/loginhome">Home</Link>
                <span> &gt; </span>
                <Link to="/makechange">This Page</Link>
            </div>
            <h1>Change Saved Schedule</h1>
            <label>Time: <input className='login-input' type="time" value={time} onChange={(event) => { setTime(event.target.value) }} required /></label><br />
            <br />
            <label>Activity: <input type="text" className='login-input' value={activity} onChange={(event) => { setActivity(event.target.value) }} required /></label><br />
            <br />
            <button onClick={handleClick} className='login-button'>Add to Schedule</button>
            <br />
            <br />
            <table className='table-schedule'>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Activity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((s, index) => (
                        <tr key={index}>
                            <td>{s.time}</td>
                            <td>{s.task}</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(s.time, s.task)} // Use an arrow function to prevent immediate invocation
                                    className='login-button'
                                    style={{ backgroundColor: 'red', fontSize: '15px' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <div className='links-container'>
                <Link to="/loginhome">Home</Link><br />
                <Link to="/addmem">Add a Family Member</Link>
            </div>
        </div>
    );
}