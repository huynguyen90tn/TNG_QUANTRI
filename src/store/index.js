import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    projects: projectReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export default store;