import React from 'react';
import { Link } from 'react-router-dom';
import './css/Configure.css';

const Configure = () => {
  return (
    <div className="configure-container">
      <h2 className="configure-title">Configure</h2>
      <div className="button-grid">
        <Link to="/main/configure/create" className="config-button">Create</Link>
        <Link to="/main/configure/add" className="config-button">Add</Link>
        <Link to="/main/configure/edit" className="config-button">Edit</Link>
        <Link to="/main/configure/delete" className="config-button">Delete</Link>
      </div>
    </div>
  );
};

export default Configure;
