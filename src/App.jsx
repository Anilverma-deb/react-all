import { useState, useEffect } from 'react';
import { GraduationCap, Users, Building, BookOpen, Star, Sparkles } from 'lucide-react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import School from './Component/School.jsx';

// Simple HomePage component
function HomePage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Education Hub</h1>
      <p>This is the home page</p>
      <Link to="/school" style={{ 
        display: 'inline-block', 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px',
        margin: '10px'
      }}>
        Go to School Management
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/school/*" element={<School />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;