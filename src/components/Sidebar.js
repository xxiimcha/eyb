import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './css/Sidebar.css';  // Your custom sidebar styles

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>E-Yearbook</h2>
      <Link to="/main/yearbook" className="sidebar-link">Yearbook</Link>
      <Link to="/main/transaction" className="sidebar-link">Transaction</Link>
      <Link to="/main/configure" className="sidebar-link">Configure</Link>
      <Link to="/main/accounts" className="sidebar-link">Accounts</Link>
      <Link to="/main/records" className="sidebar-link">Records</Link>
      <Link to="/main/analytics" className="sidebar-link">Analytics</Link>
      <Link to="/main/private" className="sidebar-link">Private</Link>
      <div className="admin-section">
        <p>Admin</p>
      </div>
    </div>
  );
}

export default Sidebar;