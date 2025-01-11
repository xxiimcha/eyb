import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ADMIN
import MainLayout from './components/MainLayout';
import Yearbook from './components/Yearbook';
import Transaction from './components/Transaction';
import Configure from './components/Configure';
import CreateBatch from './components/CreateBatch';
import EditPrototype from './components/EditPrototype';
import YearbookProfileForm from './components/YearbookProfileForm';
import Accounts from './components/Accounts';
import Records from './components/Records';
import DeletePrototype from './components/DeletePrototype';
import UserProfile from './components/UserProfile'; 
import Analytics from './components/Analytics'; 
import Private from './components/Private';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainLayout />}>
          <Route path="yearbook" element={<Yearbook />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="configure" element={<Configure />} />
          <Route path="configure/create" element={<CreateBatch />} />
          <Route path="configure/add" element={<YearbookProfileForm />} />
          <Route path="configure/delete" element={<DeletePrototype />} />
          <Route path="configure/edit" element={<EditPrototype />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="records" element={<Records />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="private" element={<Private />} />
        </Route>
        <Route path="/" element={<Navigate to="/main/yearbook" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
