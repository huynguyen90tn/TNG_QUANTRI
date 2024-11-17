// File: src/components/su_kien_review/store/su_kien_slice.js 
// Link tham khảo: https://redux-toolkit.js.org/tutorials/quick-start
// Nhánh: main
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSach: [],
  searchTerm: '',
  trangThai: 'TAT_CA',
  suKienHienTai: null,
  loading: false,
  error: null
};

const suKienSlice = createSlice({
  name: 'suKien',
  initialState,
  reducers: {
    themSuKien: (state, action) => {
      state.danhSach.push({
        ...action.payload,
        id: Date.now().toString(),
        trangThai: 'CHUA_DIEN_RA'
      });
    },
    xoaSuKien: (state, action) => {
      state.danhSach = state.danhSach.filter(sk => sk.id !== action.payload);
    },
    capNhatSuKien: (state, action) => {
      const index = state.danhSach.findIndex(sk => sk.id === action.payload.id);
      if (index !== -1) {
        state.danhSach[index] = action.payload;
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setTrangThai: (state, action) => {
      state.trangThai = action.payload;
    },
    setSuKienHienTai: (state, action) => {
      state.suKienHienTai = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  themSuKien,
  xoaSuKien,
  capNhatSuKien,
  setSearchTerm,
  setTrangThai,
  setSuKienHienTai,
  setLoading,
  setError
} = suKienSlice.actions;

export default suKienSlice.reducer;

// Selectors
export const selectAllSuKien = state => state.suKien?.danhSach || [];
export const selectSearchTerm = state => state.suKien?.searchTerm || '';
export const selectTrangThai = state => state.suKien?.trangThai || 'TAT_CA';
export const selectSuKienHienTai = state => state.suKien?.suKienHienTai;
export const selectLoading = state => state.suKien?.loading;
export const selectError = state => state.suKien?.error;