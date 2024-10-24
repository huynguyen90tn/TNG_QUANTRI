// src/App.js
import React from "react";
import { ChakraProvider, Spinner, Center } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import theme from "./styles/theme";

// Pages
import HomePage from "./pages/HomePage";
import AdminTongDashboard from "./pages/dashboard/AdminTongDashboard";
import AdminConDashboard from "./pages/dashboard/AdminConDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";
import ProjectManagement from "./pages/ProjectManagement";
import TaskManagementPage from "./pages/TaskManagementPage";
import TaskListPage from "./pages/TaskListPage";

// Auth Pages
import TaoTaiKhoanThanhVien from "./pages/auth/TaoTaiKhoanThanhVien";
import TaoTaiKhoanQuanTri from "./pages/auth/TaoTaiKhoanQuanTri";

// Components
import AttendanceTable from "./components/attendance/AttendanceTable";
import AttendanceForm from "./components/attendance/AttendanceForm";

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
      {/* Public Route */}
      <Route path="/" element={<HomePage />} />

      {/* Admin Tổng Routes */}
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
        path="/admin-tong/diem-danh"
        element={
          <ProtectedRoute requiredRole={["admin-tong"]}>
            <Layout>
              <AttendanceTable userRole="admin-tong" />
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

      {/* Admin Con Routes */}
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
        path="/admin-con/diem-danh"
        element={
          <ProtectedRoute requiredRole={["admin-con"]}>
            <Layout>
              <AttendanceTable userRole="admin-con" />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-con/tao-thanh-vien"
        element={
          <ProtectedRoute requiredRole={["admin-con"]}>
            <Layout>
              <TaoTaiKhoanThanhVien />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Member Routes */}
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
        path="/member/diem-danh"
        element={
          <ProtectedRoute requiredRole={["member"]}>
            <Layout>
              <AttendanceForm />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/lich-su-diem-danh"
        element={
          <ProtectedRoute requiredRole={["member"]}>
            <Layout>
              <AttendanceTable userRole="member" />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Shared Routes - Project Management */}
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

      {/* Task Management Routes */}
      {/* Trang quản lý nhiệm vụ chung */}
      <Route
        path="/quan-ly-nhiem-vu"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <TaskListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Trang nhiệm vụ theo dự án cụ thể */}
      <Route
        path="/quan-ly-du-an/:projectId/nhiem-vu"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <TaskManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Trang chi tiết nhiệm vụ */}
      <Route
        path="/quan-ly-nhiem-vu/:taskId"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <TaskManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
