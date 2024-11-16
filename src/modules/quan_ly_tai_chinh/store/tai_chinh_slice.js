// File: src/modules/quan_ly_tai_chinh/store/tai_chinh_slice.js
// Link tham khảo: https://redux-toolkit.js.org/api/createSlice
// Nhánh: main

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Nguồn thu 
  nguonThu: [],
  tongThuThangHienTai: 0,
  tongThuNamHienTai: 0,
  
  // Chi tiêu
  chiTieu: [],
  tongChiThangHienTai: 0, 
  tongChiNamHienTai: 0,

  // Tổng hợp
  tonKho: 0,
  canDoiThangHienTai: 0,
  canDoiNamHienTai: 0,

  // Trạng thái
  dangTaiDuLieu: false,
  loi: null,

  // Bộ lọc
  boLoc: {
    tuNgay: null,
    denNgay: null,
    loaiThu: 'TAT_CA',
    loaiChi: 'TAT_CA',
    mucTienTu: null,
    mucTienDen: null,
    trangThai: 'TAT_CA'
  },

  // Phân trang
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
    // Cập nhật nguồn thu
    themNguonThu: (state, action) => {
      state.nguonThu = [action.payload, ...state.nguonThu];
      state.tonKho += action.payload.soTien;
      
      // Cập nhật tổng thu tháng/năm hiện tại
      const ngayThu = new Date(action.payload.ngayThu);
      const thangHienTai = new Date().getMonth();
      const namHienTai = new Date().getFullYear();
      
      if (ngayThu.getFullYear() === namHienTai) {
        state.tongThuNamHienTai += action.payload.soTien;
        if (ngayThu.getMonth() === thangHienTai) {
          state.tongThuThangHienTai += action.payload.soTien;
        }
      }

      // Cập nhật cân đối
      state.canDoiThangHienTai = state.tongThuThangHienTai - state.tongChiThangHienTai;
      state.canDoiNamHienTai = state.tongThuNamHienTai - state.tongChiNamHienTai;
    },
    
    // Cập nhật chi tiêu 
    themChiTieu: (state, action) => {
      state.chiTieu = [action.payload, ...state.chiTieu];
      state.tonKho -= action.payload.soTien;

      // Cập nhật tổng chi tháng/năm hiện tại
      const ngayChi = new Date(action.payload.ngayChi);
      const thangHienTai = new Date().getMonth();
      const namHienTai = new Date().getFullYear();
      
      if (ngayChi.getFullYear() === namHienTai) {
        state.tongChiNamHienTai += action.payload.soTien;
        if (ngayChi.getMonth() === thangHienTai) {
          state.tongChiThangHienTai += action.payload.soTien;
        }
      }

      // Cập nhật cân đối
      state.canDoiThangHienTai = state.tongThuThangHienTai - state.tongChiThangHienTai;
      state.canDoiNamHienTai = state.tongThuNamHienTai - state.tongChiNamHienTai;
    },
    
    capNhatNguonThu: (state, action) => {
      const { id, ...capNhat } = action.payload;
      const index = state.nguonThu.findIndex(item => item.id === id);
      
      if (index !== -1) {
        const chenhLech = capNhat.soTien - state.nguonThu[index].soTien;
        state.nguonThu[index] = { ...state.nguonThu[index], ...capNhat };
        state.tonKho += chenhLech;

        // Cập nhật lại tổng thu & cân đối
        const ngayThu = new Date(capNhat.ngayThu);
        const thangHienTai = new Date().getMonth();
        const namHienTai = new Date().getFullYear();

        if (ngayThu.getFullYear() === namHienTai) {
          state.tongThuNamHienTai += chenhLech;
          if (ngayThu.getMonth() === thangHienTai) {
            state.tongThuThangHienTai += chenhLech;
          }
        }

        state.canDoiThangHienTai = state.tongThuThangHienTai - state.tongChiThangHienTai;
        state.canDoiNamHienTai = state.tongThuNamHienTai - state.tongChiNamHienTai;
      }
    },
    
    capNhatChiTieu: (state, action) => {
      const { id, ...capNhat } = action.payload;
      const index = state.chiTieu.findIndex(item => item.id === id);
      
      if (index !== -1) {
        const chenhLech = state.chiTieu[index].soTien - capNhat.soTien;
        state.chiTieu[index] = { ...state.chiTieu[index], ...capNhat };
        state.tonKho += chenhLech;

        // Cập nhật lại tổng chi & cân đối
        const ngayChi = new Date(capNhat.ngayChi);
        const thangHienTai = new Date().getMonth();
        const namHienTai = new Date().getFullYear();

        if (ngayChi.getFullYear() === namHienTai) {
          state.tongChiNamHienTai -= chenhLech;
          if (ngayChi.getMonth() === thangHienTai) {
            state.tongChiThangHienTai -= chenhLech;
          }
        }

        state.canDoiThangHienTai = state.tongThuThangHienTai - state.tongChiThangHienTai;
        state.canDoiNamHienTai = state.tongThuNamHienTai - state.tongChiNamHienTai;
      }
    },
    
    xoaNguonThu: (state, action) => {
      const nguonThu = state.nguonThu.find(item => item.id === action.payload);
      if (nguonThu) {
        state.tonKho -= nguonThu.soTien;
        state.nguonThu = state.nguonThu.filter(item => item.id !== action.payload);

        // Cập nhật lại tổng thu & cân đối
        const ngayThu = new Date(nguonThu.ngayThu);
        const thangHienTai = new Date().getMonth();
        const namHienTai = new Date().getFullYear();

        if (ngayThu.getFullYear() === namHienTai) {
          state.tongThuNamHienTai -= nguonThu.soTien;
          if (ngayThu.getMonth() === thangHienTai) {
            state.tongThuThangHienTai -= nguonThu.soTien;
          }
        }

        state.canDoiThangHienTai = state.tongThuThangHienTai - state.tongChiThangHienTai;
        state.canDoiNamHienTai = state.tongThuNamHienTai - state.tongChiNamHienTai;
      }
    },
    
    xoaChiTieu: (state, action) => {
      const chiTieu = state.chiTieu.find(item => item.id === action.payload);
      if (chiTieu) {
        state.tonKho += chiTieu.soTien;
        state.chiTieu = state.chiTieu.filter(item => item.id !== action.payload);

        // Cập nhật lại tổng chi & cân đối
        const ngayChi = new Date(chiTieu.ngayChi);
        const thangHienTai = new Date().getMonth();
        const namHienTai = new Date().getFullYear();

        if (ngayChi.getFullYear() === namHienTai) {
          state.tongChiNamHienTai -= chiTieu.soTien;
          if (ngayChi.getMonth() === thangHienTai) {
            state.tongChiThangHienTai -= chiTieu.soTien;
          }
        }

        state.canDoiThangHienTai = state.tongThuThangHienTai - state.tongChiThangHienTai;
        state.canDoiNamHienTai = state.tongThuNamHienTai - state.tongChiNamHienTai;
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

export default taiChinhSlice.reducer;