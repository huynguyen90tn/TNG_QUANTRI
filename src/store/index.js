// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectSlice";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import attendanceReducer from "./slices/attendanceSlice";

const store = configureStore({
  reducer: {
    projects: projectReducer,
    auth: authReducer,
    theme: themeReducer,
    attendance: attendanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
