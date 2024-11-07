// File: src/App.js
// Link tham khảo: https://chakra-ui.com/docs/components/
// Link tham khảo: https://reactrouter.com/web/guides/quick-start
// Nhánh: main 

import React from 'react';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import theme from './styles/theme';
import { ThanhVienRoutes } from './routes/thanh_vien_routes';

// Pages
import HomePage from './pages/HomePage';
import AdminTongDashboard from './pages/dashboard/AdminTongDashboard';
import AdminConDashboard from './pages/dashboard/AdminConDashboard';
import MemberDashboard from './pages/dashboard/MemberDashboard';
import ProjectManagement from './pages/ProjectManagement';
import TaskManagementPage from './pages/TaskManagementPage';
import TaskListPage from './pages/TaskListPage';
import QuanLyChiTietPage from './modules/quan_ly_chi_tiet/pages/QuanLyChiTietPage';
import NhiemVuPage from './modules/nhiem_vu_hang_ngay/pages/nhiem_vu_page';

// Auth Pages
import TaoTaiKhoanThanhVien from './pages/auth/TaoTaiKhoanThanhVien';
import TaoTaiKhoanQuanTri from './pages/auth/TaoTaiKhoanQuanTri';

// Components 
import AttendanceTable from './components/attendance/AttendanceTable';
import AttendanceForm from './components/attendance/AttendanceForm';

// Báo Cáo Components
import BaoCaoNgay from './components/bao_cao/bao_cao_ngay';
import ChiTietBaoCao from './components/bao_cao/components/chi_tiet_bao_cao';
import BaoCaoTheoDuAn from './components/bao_cao/components/bao_cao_theo_du_an';
import BaoCaoTheoNhiemVu from './components/bao_cao/components/bao_cao_theo_nhiem_vu';

// Quản lý Chi Tiết Components
import BangDuAn from './modules/quan_ly_chi_tiet/components/bang_du_an';
import ChiTietDuAn from './modules/quan_ly_chi_tiet/components/chi_tiet_du_an';
import BangNhiemVu from './modules/quan_ly_chi_tiet/components/bang_nhiem_vu';
import ChiTietNhiemVu from './modules/quan_ly_chi_tiet/components/chi_tiet_nhiem_vu';
import BangTinhNang from './modules/quan_ly_chi_tiet/components/bang_tinh_nang';
import ChiTietTinhNang from './modules/quan_ly_chi_tiet/components/chi_tiet_tinh_nang';
import BangTongHop from './modules/quan_ly_chi_tiet/components/bang_tong_hop';
import BieuDoTienDo from './modules/quan_ly_chi_tiet/components/bieu_do_tien_do';

// Backend Components
import BangBackend from './modules/quan_ly_chi_tiet/components/bang_backend';
import ChiTietBackend from './modules/quan_ly_chi_tiet/components/chi_tiet_backend';
import ThemBackend from './modules/quan_ly_chi_tiet/components/them_backend';
import ChinhSuaBackend from './modules/quan_ly_chi_tiet/components/chinh_sua_backend';

// Kiểm Thử Components
import BangKiemThu from './modules/quan_ly_chi_tiet/components/bang_kiem_thu';
import ChiTietKiemThu from './modules/quan_ly_chi_tiet/components/chi_tiet_kiem_thu';
import ThemKiemThu from './modules/quan_ly_chi_tiet/components/them_kiem_thu';
import ChinhSuaKiemThu from './modules/quan_ly_chi_tiet/components/chinh_sua_kiem_thu';

// Thống Kê Components
import BangThongKe from './modules/quan_ly_chi_tiet/components/bang_thong_ke';
import ChiTietThongKe from './modules/quan_ly_chi_tiet/components/chi_tiet_thong_ke';
import BieuDoThongKe from './modules/quan_ly_chi_tiet/components/bieu_do_thong_ke';
import BaoCaoThongKe from './modules/quan_ly_chi_tiet/components/bao_cao_thong_ke';

// Quản lý nghỉ phép Components
import QuanLyNghiPhepPage from './modules/quan_ly_nghi_phep/pages/quan_ly_nghi_phep_page';
import ChiTietDonNghiPhep from './modules/quan_ly_nghi_phep/components/chi_tiet_don_nghi_phep';
import FormTaoDonNghiPhep from './modules/quan_ly_nghi_phep/components/form_tao_don_nghi_phep';
import DanhSachDonNghiPhep from './modules/quan_ly_nghi_phep/components/danh_sach_don_nghi_phep';

// Quản lý tài sản Components
import QuanLyTaiSanPage from './modules/quan_ly_tai_san/pages/quan_ly_tai_san_page';
import DanhSachTaiSan from './modules/quan_ly_tai_san/components/danh_sach_tai_san';
import ThemTaiSan from './modules/quan_ly_tai_san/components/them_tai_san';
import CapPhatTaiSan from './modules/quan_ly_tai_san/components/cap_phat_tai_san';
import BaoTriTaiSan from './modules/quan_ly_tai_san/components/bao_tri_tai_san';
import KiemKeTaiSan from './modules/quan_ly_tai_san/components/kiem_ke_tai_san';

const ROLES = {
  ADMIN_TONG: 'admin-tong',
  ADMIN_CON: 'admin-con',
  MEMBER: 'member',
  KY_THUAT: 'ky_thuat'
};

const SHARED_ROLES = [ROLES.ADMIN_TONG, ROLES.ADMIN_CON, ROLES.MEMBER, ROLES.KY_THUAT];
const ADMIN_ROLES = [ROLES.ADMIN_TONG, ROLES.ADMIN_CON];
const MEMBER_ONLY = [ROLES.MEMBER];
const TECHNICAL_ROLES = [ROLES.ADMIN_TONG, ROLES.KY_THUAT];

const LoadingSpinner = () => (
  <Center h="100vh">
    <Spinner 
      size="xl" 
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
    />
  </Center>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location,
          message: 'Không có quyền truy cập chức năng này'
        }} 
        replace 
      />
    );
  }

  return children;
};

ProtectedRoute.defaultProps = {
  requiredRole: SHARED_ROLES
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/admin-tong"
        element={
          <ProtectedRoute requiredRole={[ROLES.ADMIN_TONG]}>
            <Layout>
              <AdminTongDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-tong/diem-danh"
        element={
          <ProtectedRoute requiredRole={[ROLES.ADMIN_TONG]}>
            <Layout>
              <AttendanceTable userRole={ROLES.ADMIN_TONG} />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-tong/tao-thanh-vien"
        element={
          <ProtectedRoute requiredRole={[ROLES.ADMIN_TONG]}>
            <Layout>
              <TaoTaiKhoanThanhVien />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tao-quan-tri"
        element={
          <ProtectedRoute requiredRole={[ROLES.ADMIN_TONG]}>
            <Layout>
              <TaoTaiKhoanQuanTri />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-con"
        element={
          <ProtectedRoute requiredRole={[ROLES.ADMIN_CON]}>
            <Layout>
              <AdminConDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-con/diem-danh"
        element={
          <ProtectedRoute requiredRole={[ROLES.ADMIN_CON]}>
            <Layout>
              <AttendanceTable userRole={ROLES.ADMIN_CON} />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-con/tao-thanh-vien"
        element={
          <ProtectedRoute requiredRole={[ROLES.ADMIN_CON]}>
            <Layout>
              <TaoTaiKhoanThanhVien />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/member"
        element={
          <ProtectedRoute requiredRole={[ROLES.MEMBER]}>
            <Layout>
              <MemberDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/diem-danh"
        element={
          <ProtectedRoute requiredRole={[ROLES.MEMBER]}>
            <Layout>
              <AttendanceForm />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/lich-su-diem-danh"
        element={
          <ProtectedRoute requiredRole={[ROLES.MEMBER]}>
            <Layout>
              <AttendanceTable userRole={ROLES.MEMBER} />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-tai-san"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <QuanLyTaiSanPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-tai-san/danh-sach"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <DanhSachTaiSan />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-tai-san/them-moi"
        element={
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Layout>
              <ThemTaiSan />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-tai-san/cap-phat"
        element={
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Layout>
              <CapPhatTaiSan />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-tai-san/bao-tri"
        element={
          <ProtectedRoute requiredRole={TECHNICAL_ROLES}>
            <Layout>
              <BaoTriTaiSan />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-tai-san/kiem-ke"
        element={
          <ProtectedRoute requiredRole={ADMIN_ROLES}>
            <Layout>
              <KiemKeTaiSan />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-du-an"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ProjectManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-nhiem-vu"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <TaskListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-du-an/:projectId/nhiem-vu"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <TaskManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-nhiem-vu/:taskId"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <TaskManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-nghi-phep"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <QuanLyNghiPhepPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-nghi-phep/danh-sach"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <DanhSachDonNghiPhep />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-nghi-phep/tao-don"
        element={
          <ProtectedRoute requiredRole={[ROLES.MEMBER]}>
            <Layout>
              <FormTaoDonNghiPhep />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-nghi-phep/:id"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ChiTietDonNghiPhep />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <QuanLyChiTietPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/backend"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BangBackend />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/backend/:backendId"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ChiTietBackend />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/backend/them-moi"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ThemBackend />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/backend/chinh-sua/:backendId"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ChinhSuaBackend />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/kiem-thu"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BangKiemThu />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/kiem-thu/:kiemThuId"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ChiTietKiemThu />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/kiem-thu/them-moi"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ThemKiemThu />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/kiem-thu/chinh-sua/:kiemThuId"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ChinhSuaKiemThu />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/thong-ke"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BangThongKe />  
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/thong-ke/:id"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ChiTietThongKe />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/thong-ke/bieu-do"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BieuDoThongKe />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quan-ly-chi-tiet/thong-ke/bao-cao"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BaoCaoThongKe />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bao-cao-ngay"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BaoCaoNgay />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bao-cao-ngay/:reportId"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <ChiTietBaoCao />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/bao-cao-theo-du-an"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BaoCaoTheoDuAn />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bao-cao-theo-nhiem-vu"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <BaoCaoTheoNhiemVu />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/nhiem-vu-hang-ngay"
        element={
          <ProtectedRoute requiredRole={SHARED_ROLES}>
            <Layout>
              <NhiemVuPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {ThanhVienRoutes()}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
