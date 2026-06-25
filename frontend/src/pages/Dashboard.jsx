import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchDashboardStats().then(setStats).catch(console.error); }, []);

  if (!stats) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Stats...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Analytics Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', minWidth: '120px' }}><p>Leads</p><h3>{stats.totalLeads}</h3></div>
        <div style={{ border: '1px solid #ccc', padding: '20px', minWidth: '120px' }}><p>Sent</p><h3>{stats.emailsSent}</h3></div>
        <div style={{ border: '1px solid #ccc', padding: '20px', minWidth: '120px' }}><p>Opened</p><h3>{stats.totalOpens}</h3></div>
        <div style={{ border: '1px solid #ccc', padding: '20px', minWidth: '120px' }}><p>Open Rate</p><h3>{stats.openRate}%</h3></div>
        <div style={{ border: '1px solid #ccc', padding: '20px', minWidth: '120px' }}><p>Clicks</p><h3>{stats.totalClicks}</h3></div>
        <div style={{ border: '1px solid #ccc', padding: '20px', minWidth: '120px' }}><p>Click Rate</p><h3>{stats.clickRate}%</h3></div>
      </div>
    </div>
  );
}