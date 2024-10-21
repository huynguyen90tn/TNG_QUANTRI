import React from 'react';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import AdminTongDashboard from './pages/dashboard/AdminTongDashboard';
import AdminConDashboard from './pages/dashboard/AdminConDashboard';
import MemberDashboard from './pages/dashboard/MemberDashboard';
import TaoTaiKhoanThanhVien from './pages/auth/TaoTaiKhoanThanhVien';
import TaoTaiKhoanQuanTri from './pages/auth/TaoTaiKhoanQuanTri';
import Layout from './components/layout/Layout';
import theme from './styles/theme';
import ProjectManagement from './pages/ProjectManagement';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user || (requiredRole && !requiredRole.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin-tong"
        element={
          <ProtectedRoute requiredRole={["admin-tong"]}>
            <Layout>
              <AdminTongDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-con"
        element={
          <ProtectedRoute requiredRole={["admin-con"]}>
            <Layout>
              <AdminConDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/member"
        element={
          <ProtectedRoute requiredRole={["member"]}>
            <Layout>
              <MemberDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tao-thanh-vien"
        element={
          <ProtectedRoute requiredRole={["admin-tong"]}>
            <Layout>
              <TaoTaiKhoanThanhVien />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tao-quan-tri"
        element={
          <ProtectedRoute requiredRole={["admin-tong"]}>
            <Layout>
              <TaoTaiKhoanQuanTri />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quan-ly-du-an"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <ProjectManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;