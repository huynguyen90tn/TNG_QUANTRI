// Link file: src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import attendanceReducer from './slices/attendanceSlice';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import themeReducer from './slices/themeSlice';
import thanhVienReducer from '../modules/quan_ly_thanh_vien/store/thanh_vien_slice';

const rootReducer = {
  projects: projectReducer,
  attendance: attendanceReducer,
  auth: authReducer,
  theme: themeReducer,
  thanhVien: thanhVienReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'attendance/addAttendanceRecord',
          'projects/fetchProjects/fulfilled',
          'auth/loginSuccess',
          'thanhVien/themThanhVien',
        ],
        ignoredPaths: [
          'attendance.attendanceRecords.timestamp',
          'projects.currentProject',
          'auth.user',
          'thanhVien.danhSach',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;