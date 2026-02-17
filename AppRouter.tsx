import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminLogin from './views/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminLostPets from './views/admin/AdminLostPets';
import AdminAdoptionPets from './views/admin/AdminAdoptionPets';
import AdminDonationCampaigns from './views/admin/AdminDonationCampaigns';
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
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
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
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
