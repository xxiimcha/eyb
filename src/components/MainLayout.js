import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Redirect to Yearbook if on the root MainLayout page */}
        {location.pathname === '/main' && <Navigate to="/main/yearbook" replace />}
        {/* Render other nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;