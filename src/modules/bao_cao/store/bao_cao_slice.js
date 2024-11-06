// Link file: src/modules/bao_cao/store/bao_cao_slice.js
// Nhánh: main

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSachBaoCao: [],
  isLoading: false,
  error: null
};

const baoCaoSlice = createSlice({
  name: 'baoCao',
  initialState,
  reducers: {
    // Thêm báo cáo mới
    themBaoCao: (state, action) => {
      state.danhSachBaoCao.push(action.payload);
    },
    
    // Cập nhật báo cáo
    capNhatBaoCao: (state, action) => {
      const { id, duLieuCapNhat } = action.payload;
      const index = state.danhSachBaoCao.findIndex(baoCao => baoCao.id === id);
      if (index !== -1) {
        state.danhSachBaoCao[index] = {
          ...state.danhSachBaoCao[index],
          ...duLieuCapNhat
        };
      }
    },
    
    // Xóa báo cáo
    xoaBaoCao: (state, action) => {
      const id = action.payload;
      state.danhSachBaoCao = state.danhSachBaoCao.filter(baoCao => baoCao.id !== id);
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Reset state
    resetState: (state) => {
      state.danhSachBaoCao = [];
      state.isLoading = false;
      state.error = null;
    }
  }
});

// Export actions
export const {
  themBaoCao,
  capNhatBaoCao,
  xoaBaoCao,
  setLoading,
  setError,
  resetState
} = baoCaoSlice.actions;

// Export selectors
export const selectDanhSachBaoCao = (state) => state.baoCao.danhSachBaoCao;
export const selectIsLoading = (state) => state.baoCao.isLoading;
export const selectError = (state) => state.baoCao.error;

// Export reducer
export default baoCaoSlice.reducer;