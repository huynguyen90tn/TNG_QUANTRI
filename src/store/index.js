// File: src/store/index.js
// Link tham khảo: https://redux-toolkit.js.org/tutorials/quick-start
// Nhánh: main
import { configureStore } from '@reduxjs/toolkit';
import suKienReducer from '../components/su_kien_review/store/su_kien_slice';

// Import các reducer core
import attendanceReducer from './slices/attendanceSlice';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import themeReducer from './slices/themeSlice';

// Import các reducer từ modules
import thanhVienReducer from '../modules/quan_ly_thanh_vien/store/thanh_vien_slice';
import nhiemVuReducer from '../modules/nhiem_vu_hang_ngay/store/nhiem_vu_slice';
import taiSanReducer from '../modules/quan_ly_tai_san/store/tai_san_slice';
import baoCaoReducer from '../modules/bao_cao/store/bao_cao_slice';
import nghiPhepReducer from '../modules/quan_ly_nghi_phep/store/nghi_phep_slice';
import luongReducer from '../modules/quan_ly_luong/store/luong_slice';

// Định nghĩa rootReducer
const rootReducer = {
  projects: projectReducer,
  attendance: attendanceReducer,
  auth: authReducer,
  theme: themeReducer,
  thanhVien: thanhVienReducer,
  nhiemVu: nhiemVuReducer,
  taiSan: taiSanReducer,
  baoCao: baoCaoReducer,
  nghiPhep: nghiPhepReducer,
  luong: luongReducer,
  suKien: suKienReducer // Thêm reducer sự kiện
};

// Cấu hình serialization
const serializationOptions = {
  ignoredActions: [
    'attendance/addAttendanceRecord',
    'projects/fetchProjects/fulfilled',
    'auth/loginSuccess',
    'thanhVien/themThanhVien',
    'taiSan/capNhat',
    'taiSan/taoBaoTri',
    'taiSan/taoKiemKe', 
    'taiSan/layLichSuBaoTri',
    'taiSan/layLichSuKiemKe',
    'baoCao/themBaoCao',
    'nghiPhep/themDonNghiPhep',
    'luong/taoMoiBangLuong',
    'luong/capNhatBangLuong',
    'luong/layDanhSachLuong',
    'luong/layLuongNhanVien',
    // Thêm actions sự kiện
    'suKien/themSuKien',
    'suKien/capNhatSuKien',
    'suKien/xoaSuKien'
  ],
  ignoredPaths: [
    'attendance.attendanceRecords.timestamp',
    'projects.currentProject',
    'auth.user',
    'thanhVien.danhSach',
    'taiSan.danhSachTaiSan',
    'taiSan.lichSuBaoTri',
    'taiSan.lichSuKiemKe',
    'baoCao.danhSachBaoCao', 
    'nghiPhep.danhSachDonNghiPhep',
    'luong.danhSachLuong',
    'luong.luongHienTai',
    'luong.kyLuong',
    // Thêm paths sự kiện
    'suKien.danhSach',
    'suKien.suKienHienTai'
  ]
};

// Khởi tạo store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: serializationOptions,
      immutableCheck: {
        warnAfter: 128
      },
      thunk: true
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

store.asyncReducers = {};

export const injectReducer = (key, reducer) => {
  if (store.asyncReducers[key]) {
    return false;
  }

  store.asyncReducers[key] = reducer;
  store.replaceReducer({
    ...rootReducer,
    ...store.asyncReducers
  });

  return true;
};

export default store;
