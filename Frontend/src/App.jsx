import React from "react";
import "./index.css";
import Sidebar from "./Pages/Sidebar";
import PythonPage from "./Pages/PythonIDE";
import SQLPage from "./Pages/sqlIDETwo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";


function App() {
  return (
    <>
      <BrowserRouter>
        <div className="w-screen h-screen overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/python" element={<PythonPage />} />
            <Route path="/sql" element={<SQLPage />} />
          </Routes>
          
        </div>
      </BrowserRouter>
      
    </>
  );
}

export default App;
