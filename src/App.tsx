import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Dashboard from './Pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import Profil from "./Pages/Profil";
import Forum from './Pages/Forum';

function App() {
  return (
      <AuthProvider>
   <Router>
       <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/Auth/login" element={<Login />} />
           <Route path="/Auth/register" element={<Register/>}/>
           <Route path="/dashboard" element={<Dashboard/>}/>
           <Route path="/profile" element={<Profil/>}/>
           <Route path="/forum" element={<Forum/>}/>
       </Routes>
   </Router>
      </AuthProvider>

  );
}

export default App;
