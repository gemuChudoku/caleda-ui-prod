// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Login/LoginForm';
import RegisterForm from './Register/RegisterForm';
import Products from './Products/Products';
import DashboardForm from './Dashboard/DashboardForm';
import RefundsForm from './Refunds/RefundsForm';
import RefundsList from './Refunds/RefundsList';
import SalesForm from './Sales/SalesForms';
import UsersForm from './Users/UsersForms';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<DashboardForm />} />
          <Route path="/products" element={<Products />} />
          <Route path="/refunds" element={<RefundsForm />} />
          <Route path="/refunds/List" element={<RefundsList />} />
          <Route path="/sales" element={<SalesForm />} />
          <Route path="/users" element={<UsersForm />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;