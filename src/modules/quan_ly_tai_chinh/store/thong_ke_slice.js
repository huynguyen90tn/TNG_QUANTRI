 
// File: src/modules/quan_ly_tai_chinh/store/thong_ke_slice.js
// Link tham khảo: https://redux-toolkit.js.org/api/createSlice
// Nhánh: main

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  thongKeTheoThang: {},
  thongKeTheoLoai: {},
  tongQuanTaiChinh: {
    tongThu: 0,
    tongChi: 0,
    tonKho: 0,
    soLuongGiaoDich: 0
  },
  bieuDo: {
    duLieuTheoThang: [],
    duLieuTheoLoai: []
  },
  dangTaiDuLieu: false,
  loi: null,
  boLoc: {
    tuNgay: null,
    denNgay: null,
    loaiThongKe: 'TAT_CA'
  }
};

const thongKeSlice = createSlice({
  name: 'thongKe',
  initialState,
  reducers: {
    datThongKeTheoThang: (state, action) => {
      state.thongKeTheoThang = action.payload;
    },
    datThongKeTheoLoai: (state, action) => {
      state.thongKeTheoLoai = action.payload;
    },
    capNhatTongQuanTaiChinh: (state, action) => {
      state.tongQuanTaiChinh = { ...state.tongQuanTaiChinh, ...action.payload };
    },
    datDuLieuBieuDo: (state, action) => {
      state.bieuDo = { ...state.bieuDo, ...action.payload };
    },
    datDangTaiDuLieu: (state, action) => {
      state.dangTaiDuLieu = action.payload;
    },
    datLoi: (state, action) => {
      state.loi = action.payload;
    },
    capNhatBoLoc: (state, action) => {
      state.boLoc = { ...state.boLoc, ...action.payload };
    },
    resetTrangThai: () => initialState
  }
});

export const {
  datThongKeTheoThang,
  datThongKeTheoLoai,
  capNhatTongQuanTaiChinh,
  datDuLieuBieuDo,
  datDangTaiDuLieu,
  datLoi,
  capNhatBoLoc,
  resetTrangThai
} = thongKeSlice.actions;

export const selectTongThu = state => state.thongKe.tongQuanTaiChinh.tongThu;
export const selectTongChi = state => state.thongKe.tongQuanTaiChinh.tongChi;
export const selectTonKho = state => state.thongKe.tongQuanTaiChinh.tonKho;
export const selectSoLuongGiaoDich = state => state.thongKe.tongQuanTaiChinh.soLuongGiaoDich;

export default thongKeSlice.reducer;