// File: src/store/index.js
// Link tham khảo: https://redux-toolkit.js.org/tutorials/quick-start
// Nhánh: main

import { configureStore } from '@reduxjs/toolkit';

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
  luong: luongReducer // Thêm reducer lương
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
    // Thêm actions lương cần bỏ qua serialization check
    'luong/taoMoiBangLuong',
    'luong/capNhatBangLuong',
    'luong/layDanhSachLuong',
    'luong/layLuongNhanVien'
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
    // Thêm paths lương cần bỏ qua serialization check
    'luong.danhSachLuong',
    'luong.luongHienTai',
    'luong.kyLuong'
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

// Khởi tạo object lưu trữ các reducer không đồng bộ 
store.asyncReducers = {};

/**
 * Hàm thêm reducer không đồng bộ vào store
 * @param {string} key - Khóa của reducer trong store
 * @param {Function} reducer - Hàm reducer cần thêm
 * @returns {boolean} - Kết quả thêm reducer
 */
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