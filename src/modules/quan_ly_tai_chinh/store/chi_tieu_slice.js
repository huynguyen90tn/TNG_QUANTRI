 
// File: src/modules/quan_ly_tai_chinh/store/chi_tieu_slice.js
// Link tham khảo: https://redux-toolkit.js.org/api/createSlice
// Nhánh: main

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSachChiTieu: [],
  chiTieuHienTai: null,
  dangTaiDuLieu: false,
  loi: null,
  boLoc: {
    tuNgay: null,
    denNgay: null,
    loaiChi: 'TAT_CA',
    trangThai: 'TAT_CA'
  },
  phanTrang: {
    trang: 1,
    soLuong: 10,
    tongSo: 0
  }
};

const chiTieuSlice = createSlice({
  name: 'chiTieu',
  initialState,
  reducers: {
    themChiTieu: (state, action) => {
      state.danhSachChiTieu.unshift(action.payload);
    },
    capNhatChiTieu: (state, action) => {
      const index = state.danhSachChiTieu.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.danhSachChiTieu[index] = action.payload;
      }
    },
    xoaChiTieu: (state, action) => {
      state.danhSachChiTieu = state.danhSachChiTieu.filter(item => item.id !== action.payload);
    },
    datDanhSachChiTieu: (state, action) => {
      state.danhSachChiTieu = action.payload;
    },
    datChiTieuHienTai: (state, action) => {
      state.chiTieuHienTai = action.payload;
    },
    datDangTaiDuLieu: (state, action) => {
      state.dangTaiDuLieu = action.payload;
    },
    datLoi: (state, action) => {
      state.loi = action.payload;
    },
    capNhatBoLoc: (state, action) => {
      state.boLoc = { ...state.boLoc, ...action.payload };
      state.phanTrang.trang = 1;
    },
    capNhatPhanTrang: (state, action) => {
      state.phanTrang = { ...state.phanTrang, ...action.payload };
    },
    resetTrangThai: () => initialState
  }
});

export const {
  themChiTieu,
  capNhatChiTieu,
  xoaChiTieu,
  datDanhSachChiTieu,
  datChiTieuHienTai,
  datDangTaiDuLieu,
  datLoi,
  capNhatBoLoc,
  capNhatPhanTrang,
  resetTrangThai
} = chiTieuSlice.actions;

export default chiTieuSlice.reducer;