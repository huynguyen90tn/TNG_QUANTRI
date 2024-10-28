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
import QuanLyChiTietPage from "./modules/quan_ly_chi_tiet/pages/QuanLyChiTietPage";

// Auth Pages
import TaoTaiKhoanThanhVien from "./pages/auth/TaoTaiKhoanThanhVien";
import TaoTaiKhoanQuanTri from "./pages/auth/TaoTaiKhoanQuanTri";

// Components
import AttendanceTable from "./components/attendance/AttendanceTable";
import AttendanceForm from "./components/attendance/AttendanceForm";

// Báo Cáo Components
import BaoCaoNgay from "./components/bao_cao/bao_cao_ngay";
import ChiTietBaoCao from "./components/bao_cao/components/chi_tiet_bao_cao";
import BaoCaoTheoDuAn from "./components/bao_cao/components/bao_cao_theo_du_an";
import BaoCaoTheoNhiemVu from "./components/bao_cao/components/bao_cao_theo_nhiem_vu";

// Quản lý Chi Tiết Components
import BangDuAn from "./modules/quan_ly_chi_tiet/components/bang_du_an";
import ChiTietDuAn from "./modules/quan_ly_chi_tiet/components/chi_tiet_du_an";
import BangNhiemVu from "./modules/quan_ly_chi_tiet/components/bang_nhiem_vu";
import ChiTietNhiemVu from "./modules/quan_ly_chi_tiet/components/chi_tiet_nhiem_vu";
import BangTinhNang from "./modules/quan_ly_chi_tiet/components/bang_tinh_nang";
import ChiTietTinhNang from "./modules/quan_ly_chi_tiet/components/chi_tiet_tinh_nang";
import BangTongHop from "./modules/quan_ly_chi_tiet/components/bang_tong_hop";
import BieuDoTienDo from "./modules/quan_ly_chi_tiet/components/bieu_do_tien_do";

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

      {/* Quản lý Chi Tiết Routes */}
      <Route
        path="/quan-ly-chi-tiet"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <QuanLyChiTietPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/tinh-nang"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <BangTinhNang />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/du-an/:duAnId"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <ChiTietDuAn />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/nhiem-vu/:nhiemVuId"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <ChiTietNhiemVu />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/tinh-nang/:tinhNangId"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <ChiTietTinhNang />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/tong-hop/:nhiemVuId"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <BangTongHop />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/tien-do/:nhiemVuId"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <BieuDoTienDo />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Báo Cáo Routes */}
      <Route
        path="/bao-cao-ngay"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <BaoCaoNgay />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bao-cao-ngay/:reportId"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <ChiTietBaoCao />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-du-an/:projectId/bao-cao"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <BaoCaoTheoDuAn />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-nhiem-vu/:taskId/bao-cao"
        element={
          <ProtectedRoute requiredRole={["admin-tong", "admin-con", "member"]}>
            <Layout>
              <BaoCaoTheoNhiemVu />
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