// File: src/components/su_kien_review/store/su_kien_slice.js
// Link tham khảo: https://redux-toolkit.js.org/tutorials/quick-start
// Nhánh: main

import { createSlice, createSelector } from '@reduxjs/toolkit';

// Initial state với kiểu dữ liệu rõ ràng
const initialState = {
  danhSach: [],
  searchTerm: '',
  trangThai: 'TAT_CA',
  suKienHienTai: null,
  loading: false,
  error: null
};

// Helper function để sắp xếp sự kiện theo thời gian
const sortSuKienTheoThoiGian = (danhSach) => {
  return [...danhSach].sort((a, b) => {
    const thoiGianA = a.ngayTao?.seconds || 0;
    const thoiGianB = b.ngayTao?.seconds || 0;
    return thoiGianB - thoiGianA;
  });
};

// Slice chính
const suKienSlice = createSlice({
  name: 'suKien',
  initialState,
  reducers: {
    // Thêm sự kiện mới
    themSuKien: (state, action) => {
      try {
        const suKienMoi = {
          ...action.payload,
          trangThai: action.payload.trangThai || 'CHUA_DIEN_RA'
        };
        state.danhSach.unshift(suKienMoi);
        state.danhSach = sortSuKienTheoThoiGian(state.danhSach);
        state.error = null;
      } catch (error) {
        console.error('Lỗi khi thêm sự kiện vào store:', error);
        state.error = error.message;
      }
    },

    // Xóa sự kiện
    xoaSuKien: (state, action) => {
      try {
        state.danhSach = state.danhSach.filter(sk => sk.id !== action.payload);
        state.error = null;
      } catch (error) {
        console.error('Lỗi khi xóa sự kiện:', error);
        state.error = error.message;
      }
    },

    // Cập nhật sự kiện
    capNhatSuKien: (state, action) => {
      try {
        const index = state.danhSach.findIndex(sk => sk.id === action.payload.id);
        if (index !== -1) {
          state.danhSach[index] = {
            ...state.danhSach[index],
            ...action.payload,
            ngayCapNhat: new Date().toISOString()
          };
          state.danhSach = sortSuKienTheoThoiGian(state.danhSach);
        }
        state.error = null;
      } catch (error) {
        console.error('Lỗi khi cập nhật sự kiện:', error);
        state.error = error.message;
      }
    },

    // Cập nhật từ khóa tìm kiếm
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    // Cập nhật trạng thái
    setTrangThai: (state, action) => {
      state.trangThai = action.payload;
    },

    // Cập nhật sự kiện hiện tại
    setSuKienHienTai: (state, action) => {
      state.suKienHienTai = action.payload;
    },

    // Cập nhật trạng thái loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Cập nhật lỗi
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Reset state về ban đầu
    resetState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

// Export actions
export const {
  themSuKien,
  xoaSuKien,
  capNhatSuKien,
  setSearchTerm,
  setTrangThai,
  setSuKienHienTai,
  setLoading,
  setError,
  resetState
} = suKienSlice.actions;

// Basic selectors
export const selectAllSuKien = state => state.suKien?.danhSach || [];
export const selectSearchTerm = state => state.suKien?.searchTerm || '';
export const selectTrangThai = state => state.suKien?.trangThai || 'TAT_CA';
export const selectSuKienHienTai = state => state.suKien?.suKienHienTai;
export const selectLoading = state => state.suKien?.loading || false;
export const selectError = state => state.suKien?.error;

// Memoized selectors cho hiệu suất tốt hơn
export const selectFilteredSuKien = createSelector(
  [selectAllSuKien, selectSearchTerm, selectTrangThai],
  (danhSach, searchTerm, trangThai) => {
    return danhSach.filter(suKien => {
      const matchSearch = !searchTerm || 
        suKien.tenSuKien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suKien.donViToChuc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suKien.diaDiem?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchTrangThai = trangThai === 'TAT_CA' || 
        suKien.trangThai === trangThai;

      return matchSearch && matchTrangThai;
    });
  }
);

// Selector cho sự kiện sắp diễn ra
export const selectSuKienSapDienRa = createSelector(
  [selectAllSuKien],
  (danhSach) => {
    const ngayHienTai = new Date();
    return danhSach.filter(suKien => {
      const ngayToChuc = new Date(suKien.ngayToChuc);
      return ngayToChuc > ngayHienTai && suKien.trangThai === 'CHUA_DIEN_RA';
    }).sort((a, b) => new Date(a.ngayToChuc) - new Date(b.ngayToChuc));
  }
);

export default suKienSlice.reducer;