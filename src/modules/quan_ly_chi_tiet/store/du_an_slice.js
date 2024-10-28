import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSachDuAn: [],
  duAnHienTai: null,
  loading: false,
  error: null,
  filters: {
    trangThai: 'all',
    phongBan: 'all'
  }
};

const duAnSlice = createSlice({
  name: 'duAn',
  initialState,
  reducers: {
    setDanhSachDuAn: (state, action) => {
      state.danhSachDuAn = action.payload;
    },
    setDuAnHienTai: (state, action) => {
      state.duAnHienTai = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetDuAnState: () => initialState,
    themDuAnMoi: (state, action) => {
      state.danhSachDuAn.unshift(action.payload);
    },
    capNhatDuAn: (state, action) => {
      const index = state.danhSachDuAn.findIndex(
        duAn => duAn.id === action.payload.id
      );
      if (index !== -1) {
        state.danhSachDuAn[index] = {
          ...state.danhSachDuAn[index],
          ...action.payload
        };
        if (state.duAnHienTai?.id === action.payload.id) {
          state.duAnHienTai = {
            ...state.duAnHienTai,
            ...action.payload
          };
        }
      }
    },
    xoaDuAn: (state, action) => {
      state.danhSachDuAn = state.danhSachDuAn.filter(
        duAn => duAn.id !== action.payload
      );
      if (state.duAnHienTai?.id === action.payload) {
        state.duAnHienTai = null;
      }
    }
  }
});

export const {
  setDanhSachDuAn,
  setDuAnHienTai,
  setLoading,
  setError,
  setFilters,
  resetDuAnState,
  themDuAnMoi,
  capNhatDuAn,
  xoaDuAn
} = duAnSlice.actions;

export default duAnSlice.reducer;