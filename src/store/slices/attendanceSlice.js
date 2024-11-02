// Link file: src/store/slices/attendanceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendanceRecords: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    addAttendanceRecord: (state, action) => {
      state.attendanceRecords.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addAttendanceRecord, setLoading, setError } = attendanceSlice.actions;
export default attendanceSlice.reducer;