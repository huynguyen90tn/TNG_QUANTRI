 
// File: src/modules/quan_ly_tai_chinh/store/nguon_thu_slice.js
// Link tham khảo: https://redux-toolkit.js.org/api/createSlice
// Nhánh: main

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSachNguonThu: [],
  nguonThuHienTai: null,
  dangTaiDuLieu: false,
  loi: null,
  boLoc: {
    tuNgay: null,
    denNgay: null,
    loaiThu: 'TAT_CA',
    trangThai: 'TAT_CA'
  },
  phanTrang: {
    trang: 1,
    soLuong: 10,
    tongSo: 0
  }
};

const nguonThuSlice = createSlice({
  name: 'nguonThu',
  initialState,
  reducers: {
    themNguonThu: (state, action) => {
      state.danhSachNguonThu.unshift(action.payload);
    },
    capNhatNguonThu: (state, action) => {
      const index = state.danhSachNguonThu.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.danhSachNguonThu[index] = action.payload;
      }
    },
    xoaNguonThu: (state, action) => {
      state.danhSachNguonThu = state.danhSachNguonThu.filter(item => item.id !== action.payload);
    },
    datDanhSachNguonThu: (state, action) => {
      state.danhSachNguonThu = action.payload;
    },
    datNguonThuHienTai: (state, action) => {
      state.nguonThuHienTai = action.payload;
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
  themNguonThu,
  capNhatNguonThu,
  xoaNguonThu,
  datDanhSachNguonThu,
  datNguonThuHienTai,
  datDangTaiDuLieu,
  datLoi,
  capNhatBoLoc,
  capNhatPhanTrang,
  resetTrangThai
} = nguonThuSlice.actions;

export default nguonThuSlice.reducer;