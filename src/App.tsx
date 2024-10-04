import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Auth/Login';

function About() {
    return <h2>About Page</h2>;
}

function App() {
  return (
   <Router>
       <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
       </Routes>
   </Router>

  );
}

export default App;
