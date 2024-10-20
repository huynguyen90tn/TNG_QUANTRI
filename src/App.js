import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import AdminTongDashboard from './pages/dashboard/AdminTongDashboard';
import AdminConDashboard from './pages/dashboard/AdminConDashboard';
import MemberDashboard from './pages/dashboard/MemberDashboard';
import TaoTaiKhoanThanhVien from './pages/auth/TaoTaiKhoanThanhVien';
import TaoTaiKhoanQuanTri from './pages/auth/TaoTaiKhoanQuanTri';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/layout/Layout';
import theme from './styles/theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Sidebar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/admin-tong"
              element={
                <Layout>
                  <ProtectedRoute requiredRole="master-admin">
                    <AdminTongDashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin-con"
              element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <AdminConDashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/member"
              element={
                <Layout>
                  <ProtectedRoute requiredRole="member">
                    <MemberDashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/tao-thanh-vien"
              element={
                <Layout>
                  <ProtectedRoute requiredRole="master-admin">
                    <TaoTaiKhoanThanhVien />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/tao-quan-tri"
              element={
                <Layout>
                  <ProtectedRoute requiredRole="master-admin">
                    <TaoTaiKhoanQuanTri />
                  </ProtectedRoute>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;