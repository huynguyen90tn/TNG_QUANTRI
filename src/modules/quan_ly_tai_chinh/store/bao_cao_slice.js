 
// File: src/modules/quan_ly_tai_chinh/store/tai_chinh_slice.js
// Link tham khảo: https://redux-toolkit.js.org/api/createSlice
// Nhánh: main

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nguonThu: [],
  chiTieu: [],
  tonKho: 0,
  dangTaiDuLieu: false,
  loi: null,
  boLoc: {
    tuNgay: null,
    denNgay: null,
    loaiThu: 'TAT_CA',
    loaiChi: 'TAT_CA',
  },
  phanTrang: {
    trang: 1,
    soLuong: 10,
    tongSo: 0
  }
};

const taiChinhSlice = createSlice({
  name: 'taiChinh',
  initialState,
  reducers: {
    themNguonThu: (state, action) => {
      state.nguonThu.push(action.payload);
      state.tonKho += action.payload.soTien;
    },
    
    themChiTieu: (state, action) => {
      state.chiTieu.push(action.payload);
      state.tonKho -= action.payload.soTien;
    },
    
    capNhatNguonThu: (state, action) => {
      const { id, ...capNhat } = action.payload;
      const index = state.nguonThu.findIndex(item => item.id === id);
      if (index !== -1) {
        const chenhLech = capNhat.soTien - state.nguonThu[index].soTien;
        state.nguonThu[index] = { ...state.nguonThu[index], ...capNhat };
        state.tonKho += chenhLech;
      }
    },
    
    capNhatChiTieu: (state, action) => {
      const { id, ...capNhat } = action.payload;
      const index = state.chiTieu.findIndex(item => item.id === id);
      if (index !== -1) {
        const chenhLech = state.chiTieu[index].soTien - capNhat.soTien;
        state.chiTieu[index] = { ...state.chiTieu[index], ...capNhat };
        state.tonKho += chenhLech;
      }
    },
    
    xoaNguonThu: (state, action) => {
      const nguonThu = state.nguonThu.find(item => item.id === action.payload);
      if (nguonThu) {
        state.tonKho -= nguonThu.soTien;
        state.nguonThu = state.nguonThu.filter(item => item.id !== action.payload);
      }
    },
    
    xoaChiTieu: (state, action) => {
      const chiTieu = state.chiTieu.find(item => item.id === action.payload);
      if (chiTieu) {
        state.tonKho += chiTieu.soTien;
        state.chiTieu = state.chiTieu.filter(item => item.id !== action.payload);
      }
    },
    
    capNhatBoLoc: (state, action) => {
      state.boLoc = { ...state.boLoc, ...action.payload };
      state.phanTrang.trang = 1;
    },
    
    datTrangThaiTaiDuLieu: (state, action) => {
      state.dangTaiDuLieu = action.payload;
    },
    
    datLoi: (state, action) => {
      state.loi = action.payload;
    },
    
    capNhatPhanTrang: (state, action) => {
      state.phanTrang = { ...state.phanTrang, ...action.payload };
    },
    
    resetTrangThai: () => initialState
  }
});

export const {
  themNguonThu,
  themChiTieu,
  capNhatNguonThu,
  capNhatChiTieu,
  xoaNguonThu,
  xoaChiTieu,
  capNhatBoLoc,
  datTrangThaiTaiDuLieu,
  datLoi,
  capNhatPhanTrang,
  resetTrangThai
} = taiChinhSlice.actions;

export const selectTongThu = state => state.taiChinh.nguonThu.reduce(
  (total, item) => total + item.soTien, 0
);

export const selectTongChi = state => state.taiChinh.chiTieu.reduce(
  (total, item) => total + item.soTien, 0
);

export const selectTonKho = state => state.taiChinh.tonKho;

export const selectBoLoc = state => state.taiChinh.boLoc;

export const selectPhanTrang = state => state.taiChinh.phanTrang;

export default taiChinhSlice.reducer;