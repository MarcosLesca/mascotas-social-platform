import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminLogin from './views/admin/AdminLogin';
import SignUp from './views/auth/SignUp';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminLostPets from './views/admin/AdminLostPets';
import AdminAdoptionPets from './views/admin/AdminAdoptionPets';
import AdminDonationCampaigns from './views/admin/AdminDonationCampaigns';
import UserDashboard from './views/users/UserDashboard';
import UserLostPets from './views/users/UserLostPets';
import UserAdoption from './views/users/UserAdoption';
import UserDonations from './views/users/UserDonations';
import ProtectedRoute from './components/admin/ProtectedRoute';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - all render App component which handles view switching */}
        <Route path="/" element={<App />} />
        <Route path="/lost-pets" element={<App />} />
        <Route path="/adoption" element={<App />} />
        <Route path="/donations" element={<App />} />
        <Route path="/faq" element={<App />} />
        <Route path="/about-us" element={<App />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Admin routes - only for admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="lost-pets" element={<AdminLostPets />} />
          <Route path="adoption" element={<AdminAdoptionPets />} />
          <Route path="donations" element={<AdminDonationCampaigns />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        
        {/* User routes - only for user role */}
        <Route
          path="/mi-cuenta"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserLostPets />} />
          <Route path="lost-pets" element={<UserLostPets />} />
          <Route path="adoption" element={<UserAdoption />} />
          <Route path="donations" element={<UserDonations />} />
          <Route path="*" element={<Navigate to="/mi-cuenta" replace />} />
        </Route>
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
