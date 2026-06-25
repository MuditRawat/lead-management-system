import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LeadForm from './pages/LeadForm';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: '20px', background: '#222', padding: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Lead Form</Link>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Analytics Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LeadForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}