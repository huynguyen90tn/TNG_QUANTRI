// src/modules/quan_ly_chi_tiet/store/nhiem_vu_slice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSachNhiemVu: [],
  nhiemVuHienTai: null,
  loading: false,
  error: null,
  filters: {
    trangThai: 'all',
    nguoiPhuTrach: 'all',
    search: ''
  },
  thongKe: {
    tongSoNhiemVu: 0,
    daHoanThanh: 0,
    dangThucHien: 0,
    chuaBatDau: 0,
    quaHan: 0,
    tienDoTrungBinh: 0
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

const nhiemVuSlice = createSlice({
  name: 'nhiemVu',
  initialState,
  reducers: {
    setDanhSachNhiemVu: (state, action) => {
      state.danhSachNhiemVu = action.payload;
      
      // Cập nhật thống kê
      const tongSo = action.payload.length;
      const daHoanThanh = action.payload.filter(nv => 
        nv.trangThai === 'HOAN_THANH'
      ).length;
      const dangThucHien = action.payload.filter(nv => 
        nv.trangThai === 'DANG_LAM'
      ).length;
      const chuaBatDau = tongSo - daHoanThanh - dangThucHien;
      const quaHan = action.payload.filter(nv => {
        const deadline = new Date(nv.deadline);
        return deadline < new Date() && nv.trangThai !== 'HOAN_THANH';
      }).length;
      const tienDoTrungBinh = action.payload.reduce((acc, nv) => 
        acc + nv.tienDo, 0
      ) / tongSo;

      state.thongKe = {
        tongSoNhiemVu: tongSo,
        daHoanThanh,
        dangThucHien,
        chuaBatDau,
        quaHan,
        tienDoTrungBinh: Math.round(tienDoTrungBinh)
      };
    },

    setNhiemVuHienTai: (state, action) => {
      state.nhiemVuHienTai = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },

    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    },

    resetNhiemVuState: () => initialState,

    themNhiemVuMoi: (state, action) => {
      state.danhSachNhiemVu.unshift(action.payload);
      state.pagination.total += 1;
      
      // Cập nhật thống kê
      state.thongKe.tongSoNhiemVu += 1;
      if (action.payload.trangThai === 'DANG_LAM') {
        state.thongKe.dangThucHien += 1;
      } else if (action.payload.trangThai === 'HOAN_THANH') {
        state.thongKe.daHoanThanh += 1;
      } else {
        state.thongKe.chuaBatDau += 1;
      }

      const tienDoMoi = state.danhSachNhiemVu.reduce((acc, nv) => 
        acc + nv.tienDo, 0
      ) / state.danhSachNhiemVu.length;
      state.thongKe.tienDoTrungBinh = Math.round(tienDoMoi);
    },

    capNhatNhiemVu: (state, action) => {
      const index = state.danhSachNhiemVu.findIndex(
        nv => nv.id === action.payload.id
      );

      if (index !== -1) {
        const nhiemVuCu = state.danhSachNhiemVu[index];
        state.danhSachNhiemVu[index] = {
          ...nhiemVuCu,
          ...action.payload
        };

        // Cập nhật thống kê
        if (nhiemVuCu.trangThai !== action.payload.trangThai) {
          if (nhiemVuCu.trangThai === 'DANG_LAM') state.thongKe.dangThucHien -= 1;
          else if (nhiemVuCu.trangThai === 'HOAN_THANH') state.thongKe.daHoanThanh -= 1;
          else state.thongKe.chuaBatDau -= 1;

          if (action.payload.trangThai === 'DANG_LAM') state.thongKe.dangThucHien += 1;
          else if (action.payload.trangThai === 'HOAN_THANH') state.thongKe.daHoanThanh += 1;
          else state.thongKe.chuaBatDau += 1;
        }

        const tienDoMoi = state.danhSachNhiemVu.reduce((acc, nv) => 
          acc + nv.tienDo, 0
        ) / state.danhSachNhiemVu.length;
        state.thongKe.tienDoTrungBinh = Math.round(tienDoMoi);

        // Cập nhật nhiệm vụ hiện tại nếu đang xem
        if (state.nhiemVuHienTai?.id === action.payload.id) {
          state.nhiemVuHienTai = {
            ...state.nhiemVuHienTai,
            ...action.payload
          };
        }
      }
    },

    xoaNhiemVu: (state, action) => {
      const nhiemVuXoa = state.danhSachNhiemVu.find(
        nv => nv.id === action.payload
      );

      if (nhiemVuXoa) {
        // Cập nhật thống kê
        state.thongKe.tongSoNhiemVu -= 1;
        if (nhiemVuXoa.trangThai === 'DANG_LAM') state.thongKe.dangThucHien -= 1;
        else if (nhiemVuXoa.trangThai === 'HOAN_THANH') state.thongKe.daHoanThanh -= 1;
        else state.thongKe.chuaBatDau -= 1;

        state.danhSachNhiemVu = state.danhSachNhiemVu.filter(
          nv => nv.id !== action.payload
        );

        const tienDoMoi = state.danhSachNhiemVu.reduce((acc, nv) => 
          acc + nv.tienDo, 0
        ) / (state.danhSachNhiemVu.length || 1);
        state.thongKe.tienDoTrungBinh = Math.round(tienDoMoi);

        state.pagination.total -= 1;

        if (state.nhiemVuHienTai?.id === action.payload) {
          state.nhiemVuHienTai = null;
        }
      }
    },

    capNhatTienDoNhiemVu: (state, action) => {
      const { nhiemVuId, tienDoMoi } = action.payload;
      const index = state.danhSachNhiemVu.findIndex(
        nv => nv.id === nhiemVuId
      );

      if (index !== -1) {
        state.danhSachNhiemVu[index].tienDo = tienDoMoi;
        
        const tienDoTB = state.danhSachNhiemVu.reduce((acc, nv) => 
          acc + nv.tienDo, 0
        ) / state.danhSachNhiemVu.length;
        state.thongKe.tienDoTrungBinh = Math.round(tienDoTB);

        if (state.nhiemVuHienTai?.id === nhiemVuId) {
          state.nhiemVuHienTai.tienDo = tienDoMoi;
        }
      }
    },

    capNhatDeadlineNhiemVu: (state, action) => {
      const { nhiemVuId, deadlineMoi } = action.payload;
      const index = state.danhSachNhiemVu.findIndex(
        nv => nv.id === nhiemVuId
      );

      if (index !== -1) {
        state.danhSachNhiemVu[index].deadline = deadlineMoi;
        
        // Cập nhật số nhiệm vụ quá hạn
        const quaHan = state.danhSachNhiemVu.filter(nv => {
          const deadline = new Date(nv.deadline);
          return deadline < new Date() && nv.trangThai !== 'HOAN_THANH';
        }).length;
        state.thongKe.quaHan = quaHan;

        if (state.nhiemVuHienTai?.id === nhiemVuId) {
          state.nhiemVuHienTai.deadline = deadlineMoi;
        }
      }
    }
  }
});

export const {
  setDanhSachNhiemVu,
  setNhiemVuHienTai,
  setLoading,
  setError,
  setFilters,
  setPagination,
  resetNhiemVuState,
  themNhiemVuMoi,
  capNhatNhiemVu,
  xoaNhiemVu,
  capNhatTienDoNhiemVu,
  capNhatDeadlineNhiemVu
} = nhiemVuSlice.actions;

export default nhiemVuSlice.reducer;