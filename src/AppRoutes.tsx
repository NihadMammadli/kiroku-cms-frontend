import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/index';
import Login from './pages/Login';
import Branches from './pages/Branches';
import Dashboard from './pages/Dashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/branches"
        element={
          <Layout>
            <Branches />
          </Layout>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={
          <Layout>
            <div>
              <h2>404 - Səhifə tapılmadı</h2>
              <p>Axtardığınız səhifə mövcud deyil.</p>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
