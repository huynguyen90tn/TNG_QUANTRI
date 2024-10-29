// src/modules/quan_ly_chi_tiet/store/tinh_nang_slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSachTinhNang: [],
  tinhNangHienTai: null,
  loading: false,
  error: null,
  filters: {
    phanHe: 'all',
    trangThai: 'all',
    nguoiPhuTrach: 'all',
    search: ''
  },
  thongKe: {
    tongSoTinhNang: 0,
    daHoanThanh: 0,
    dangThucHien: 0,
    chuaBatDau: 0,
    tienDoTrungBinh: 0
  }
};

const tinhNangSlice = createSlice({
  name: 'tinhNang',
  initialState,
  reducers: {
    setDanhSachTinhNang: (state, action) => {
      state.danhSachTinhNang = action.payload;
      // Cập nhật thống kê
      const tongSo = action.payload.length;
      const daHoanThanh = action.payload.filter(tn => 
        tn.frontend.trangThai === 'HOAN_THANH' &&
        tn.backend.trangThai === 'HOAN_THANH' &&
        tn.kiemThu.trangThai === 'HOAN_THANH'
      ).length;
      const dangThucHien = action.payload.filter(tn =>
        tn.frontend.trangThai === 'DANG_CODE' ||
        tn.backend.trangThai === 'DANG_LAM_API' ||
        tn.kiemThu.trangThai === 'DANG_TEST'
      ).length;
      const chuaBatDau = tongSo - daHoanThanh - dangThucHien;
      const tienDoTrungBinh = action.payload.reduce((acc, tn) => {
        const tienDo = (tn.frontend.tienDo + tn.backend.tienDo + tn.kiemThu.tienDo) / 3;
        return acc + tienDo;
      }, 0) / tongSo;

      state.thongKe = {
        tongSoTinhNang: tongSo,
        daHoanThanh,
        dangThucHien,
        chuaBatDau,
        tienDoTrungBinh: Math.round(tienDoTrungBinh)
      };
    },

    setTinhNangHienTai: (state, action) => {
      state.tinhNangHienTai = action.payload;
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

    resetTinhNangState: () => initialState,

    themTinhNangMoi: (state, action) => {
      state.danhSachTinhNang.unshift(action.payload);
      state.thongKe.tongSoTinhNang += 1;
    },

    capNhatTinhNang: (state, action) => {
      const index = state.danhSachTinhNang.findIndex(
        tinhNang => tinhNang.id === action.payload.id
      );
      if (index !== -1) {
        state.danhSachTinhNang[index] = {
          ...state.danhSachTinhNang[index],
          ...action.payload
        };
        if (state.tinhNangHienTai?.id === action.payload.id) {
          state.tinhNangHienTai = {
            ...state.tinhNangHienTai,
            ...action.payload
          };
        }

        // Cập nhật lại thống kê
        const tongSo = state.danhSachTinhNang.length;
        const daHoanThanh = state.danhSachTinhNang.filter(tn => 
          tn.frontend.trangThai === 'HOAN_THANH' &&
          tn.backend.trangThai === 'HOAN_THANH' &&
          tn.kiemThu.trangThai === 'HOAN_THANH'
        ).length;
        const dangThucHien = state.danhSachTinhNang.filter(tn =>
          tn.frontend.trangThai === 'DANG_CODE' ||
          tn.backend.trangThai === 'DANG_LAM_API' ||
          tn.kiemThu.trangThai === 'DANG_TEST'
        ).length;

        state.thongKe = {
          ...state.thongKe,
          daHoanThanh,
          dangThucHien,
          chuaBatDau: tongSo - daHoanThanh - dangThucHien
        };
      }
    },

    xoaTinhNang: (state, action) => {
      state.danhSachTinhNang = state.danhSachTinhNang.filter(
        tinhNang => tinhNang.id !== action.payload
      );
      if (state.tinhNangHienTai?.id === action.payload) {
        state.tinhNangHienTai = null;
      }
      state.thongKe.tongSoTinhNang -= 1;
    },

    capNhatTienDoPhanHe: (state, action) => {
      const { tinhNangId, phanHe, tienDoData } = action.payload;
      const index = state.danhSachTinhNang.findIndex(
        tinhNang => tinhNang.id === tinhNangId
      );
      if (index !== -1) {
        state.danhSachTinhNang[index][phanHe] = {
          ...state.danhSachTinhNang[index][phanHe],
          ...tienDoData
        };
        if (state.tinhNangHienTai?.id === tinhNangId) {
          state.tinhNangHienTai[phanHe] = {
            ...state.tinhNangHienTai[phanHe],
            ...tienDoData
          };
        }

        // Cập nhật tiến độ trung bình
        const tienDoTrungBinh = state.danhSachTinhNang.reduce((acc, tn) => {
          const tienDo = (tn.frontend.tienDo + tn.backend.tienDo + tn.kiemThu.tienDo) / 3;
          return acc + tienDo;
        }, 0) / state.danhSachTinhNang.length;

        state.thongKe.tienDoTrungBinh = Math.round(tienDoTrungBinh);
      }
    }
  }
});

export const {
  setDanhSachTinhNang,
  setTinhNangHienTai,
  setLoading,
  setError,
  setFilters,
  resetTinhNangState,
  themTinhNangMoi,
  capNhatTinhNang,
  xoaTinhNang,
  capNhatTienDoPhanHe
} = tinhNangSlice.actions;

export default tinhNangSlice.reducer;