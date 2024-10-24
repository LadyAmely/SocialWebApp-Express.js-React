import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Dashboard from './Pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import Profil from "./Pages/Profil";
import Forum from './Pages/Forum';
import Events from './Pages/Events';
import Community from "./Pages/Community";
import News from './Pages/News';

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
           <Route path="/events" element={<Events/>}/>
           <Route path="/community" element={<Community/>}/>
           <Route path="/news" element={<News/>}/>
       </Routes>
   </Router>
      </AuthProvider>

  );
}

export default App;
