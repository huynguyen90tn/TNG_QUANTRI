// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectSlice";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import attendanceReducer from "./slices/attendanceSlice";
import nhiemVuReducer from "../components/quan_ly_nhiem_vu_chi_tiet/store/nhiem_vu_slice";

const store = configureStore({
  reducer: {
    projects: projectReducer,
    auth: authReducer,
    theme: themeReducer,
    attendance: attendanceReducer,
    nhiemVu: nhiemVuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;