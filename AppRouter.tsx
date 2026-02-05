import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminLogin from './views/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminLostPets from './views/admin/AdminLostPets';
import AdminAdoptionPets from './views/admin/AdminAdoptionPets';
import ProtectedRoute from './components/admin/ProtectedRoute';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
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
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
