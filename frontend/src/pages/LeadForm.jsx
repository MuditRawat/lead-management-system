import React, { useState } from 'react';
import { submitLead } from '../services/api';

export default function LeadForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', requirement: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Submitting...');
    try { await submitLead(formData); setMsg('🎉 Success! Form Submitted.'); } 
    catch { setMsg('Error submitting structural lead data.'); }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Capture Lead</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Name *" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email *" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="text" placeholder="Phone *" onChange={e => setFormData({...formData, phone: e.target.value})} required />
        <input type="text" placeholder="Company" onChange={e => setFormData({...formData, company: e.target.value})} />
        <textarea placeholder="Requirement *" onChange={e => setFormData({...formData, requirement: e.target.value})} required />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>Submit</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}