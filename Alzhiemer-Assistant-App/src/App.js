import React from "react";
import { Route, Routes} from "react-router-dom";
import Home from "./Home.js";
import DailySchedule from "./paths/DailySchedule.js";
import ViewMembers from "./paths/ViewMembers.js";
import FaceRecog from "./paths/FaceRecog.js";
import EditerLogin from "./paths/EditerLogin.js";
import EditSchedule from "./paths/EditSchedule.js";
import AddMembers from './paths/AddMembers.js';
import SOSbutton from "./paths/SOSbutton.js";
import HomeLogin from './paths/HomeLogin.js';
import './App.css';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/schedule" element={<DailySchedule/>} />
        <Route path="/family" element={<ViewMembers/>} />
        <Route path="/recognize" element={<FaceRecog/>} />
        <Route path="/edit" element={<EditerLogin/>} />
        <Route path="/makechange" element={<EditSchedule/>} />
        <Route path="/addmem" element={<AddMembers/>} />
        <Route path="/sos" element={<SOSbutton/>} />
        <Route path="/loginhome" element={<HomeLogin/>}/>

      </Routes>
    </div>
  );
}