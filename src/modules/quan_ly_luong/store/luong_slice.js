// File: src/modules/quan_ly_luong/store/luong_slice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as luongService from '../services/luong_service';

const initialState = {
  danhSachLuong: [],
  luongHienTai: null,
  loading: false,
  error: null,
  thongBao: null,
  tongLuong: {
    luongCoBan: 0,
    luongThuong: 0,
    phuCap: 0,
    thueTNCN: 0,
    baoHiem: 0,
    thucLinh: 0
  }
};

export const layDanhSachLuong = createAsyncThunk(
  'luong/layDanhSachLuong',
  async (_, { rejectWithValue }) => {
    try {
      const response = await luongService.getAllSalaries();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const layLuongNhanVien = createAsyncThunk(
  'luong/layLuongNhanVien',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await luongService.getUserSalary(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const taoMoiBangLuong = createAsyncThunk(
  'luong/taoMoiBangLuong',
  async (data, { rejectWithValue }) => {
    try {
      const response = await luongService.createSalary(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const capNhatBangLuong = createAsyncThunk(
  'luong/capNhatBangLuong',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await luongService.updateSalary(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const luongSlice = createSlice({
  name: 'luong',
  initialState,
  reducers: {
    datLaiLoi: (state) => {
      state.error = null;
    },
    datLaiThongBao: (state) => {
      state.thongBao = null;
    },
    xoaLuongHienTai: (state) => {
      state.luongHienTai = null;
    },
    capNhatTongLuong: (state) => {
      const tong = state.danhSachLuong.reduce((acc, luong) => ({
        luongCoBan: acc.luongCoBan + luong.luongCoBan,
        luongThuong: acc.luongThuong + luong.luongThuong,
        phuCap: acc.phuCap + Object.values(luong.phuCap).reduce((a, b) => a + b, 0),
        thueTNCN: acc.thueTNCN + luong.thueTNCN,
        baoHiem: acc.baoHiem + Object.values(luong.baoHiem).reduce((a, b) => a + b, 0),
        thucLinh: acc.thucLinh + luong.thucLinh
      }), {...state.tongLuong});

      state.tongLuong = tong;
    }
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách lương
      .addCase(layDanhSachLuong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(layDanhSachLuong.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachLuong = action.payload || [];
        state.error = null;
      })
      .addCase(layDanhSachLuong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Lấy lương nhân viên
      .addCase(layLuongNhanVien.pending, (state) => {
        state.loading = true;
        state.error = null;  
      })
      .addCase(layLuongNhanVien.fulfilled, (state, action) => {
        state.loading = false;
        state.luongHienTai = action.payload[0] || null;
        state.error = null;
      })
      .addCase(layLuongNhanVien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Tạo mới bảng lương
      .addCase(taoMoiBangLuong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taoMoiBangLuong.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachLuong = [action.payload, ...state.danhSachLuong];
        state.thongBao = 'Tạo bảng lương thành công';
        state.error = null;
      })
      .addCase(taoMoiBangLuong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cập nhật bảng lương
      .addCase(capNhatBangLuong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(capNhatBangLuong.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.danhSachLuong.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.danhSachLuong[index] = action.payload;
          state.thongBao = 'Cập nhật bảng lương thành công';
        }
        state.error = null;
      })
      .addCase(capNhatBangLuong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  datLaiLoi,
  datLaiThongBao,
  xoaLuongHienTai,
  capNhatTongLuong
} = luongSlice.actions;

export default luongSlice.reducer;