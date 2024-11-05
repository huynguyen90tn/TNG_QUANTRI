// File: src/modules/nhiem_vu_hang_ngay/store/nhiem_vu_slice.js
// Link tham khảo: https://redux-toolkit.js.org/api/createSlice
// Link tham khảo: https://redux-toolkit.js.org/api/createAsyncThunk

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import nhiemVuService from '../services/nhiem_vu_service';

export const taoNhiemVuAsync = createAsyncThunk(
  'nhiemVu/taoNhiemVu',
  async (nhiemVuData) => {
    try {
      const response = await nhiemVuService.taoNhiemVu(nhiemVuData);
      return response;
    } catch (error) {
      console.error('Lỗi tạo nhiệm vụ:', error);
      throw error;
    }
  }
);

export const layDanhSachNhiemVuAsync = createAsyncThunk(
  'nhiemVu/layDanhSach',
  async ({ startDate, endDate, filterType }) => {
    try {
      const response = await nhiemVuService.layDanhSachNhiemVu(startDate, endDate, filterType);
      return response;
    } catch (error) {
      console.error('Lỗi lấy danh sách nhiệm vụ:', error);
      throw error;
    }
  }
);

export const batDauKiemTraAsync = createAsyncThunk(
  'nhiemVu/batDauKiemTra',
  async ({ nhiemVuId, userId }, { rejectWithValue }) => {
    try {
      const response = await nhiemVuService.batDauKiemTra(nhiemVuId, userId);
      return { 
        nhiemVuId,
        userId,
        thoiGianKiemTra: response
      };
    } catch (error) {
      console.error('Lỗi bắt đầu kiểm tra:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const hoanThanhKiemTraAsync = createAsyncThunk(
  'nhiemVu/hoanThanhKiemTra',
  async ({ nhiemVuId, userId, ketQua }, { rejectWithValue }) => {
    try {
      await nhiemVuService.hoanThanhKiemTra(nhiemVuId, userId, ketQua);
      return { nhiemVuId, userId, ketQua, thoiGian: new Date() };
    } catch (error) {
      console.error('Lỗi hoàn thành kiểm tra:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const xoaNhiemVuAsync = createAsyncThunk(
  'nhiemVu/xoaNhiemVu',
  async (nhiemVuId, { rejectWithValue }) => {
    try {
      await nhiemVuService.xoaNhiemVu(nhiemVuId);
      return nhiemVuId;
    } catch (error) {
      console.error('Lỗi xóa nhiệm vụ:', error);
      return rejectWithValue(error.message);
    }
  }
);

const nhiemVuSlice = createSlice({
  name: 'nhiemVu',
  initialState: {
    danhSachNhiemVu: [],
    loading: false,
    error: null,
    kiemTraHienTai: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearKiemTraHienTai: (state) => {
      state.kiemTraHienTai = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Tạo nhiệm vụ
      .addCase(taoNhiemVuAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taoNhiemVuAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachNhiemVu.unshift(action.payload);
      })
      .addCase(taoNhiemVuAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Lấy danh sách
      .addCase(layDanhSachNhiemVuAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(layDanhSachNhiemVuAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachNhiemVu = action.payload;
      })
      .addCase(layDanhSachNhiemVuAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Bắt đầu kiểm tra
      .addCase(batDauKiemTraAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batDauKiemTraAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.kiemTraHienTai = action.payload;
        
        const nhiemVu = state.danhSachNhiemVu.find(
          nv => nv.id === action.payload.nhiemVuId
        );
        if (nhiemVu) {
          nhiemVu.danhSachDangKiemTra = nhiemVu.danhSachDangKiemTra || [];
          nhiemVu.danhSachDangKiemTra.push({
            userId: action.payload.userId,
            thoiGianBatDau: new Date(),
            thoiGianKetThuc: new Date(Date.now() + nhiemVuService.VERIFICATION_TIME)
          });
        }
      })
      .addCase(batDauKiemTraAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Hoàn thành kiểm tra
      .addCase(hoanThanhKiemTraAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hoanThanhKiemTraAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.kiemTraHienTai = null;

        const nhiemVu = state.danhSachNhiemVu.find(
          nv => nv.id === action.payload.nhiemVuId
        );
        if (nhiemVu) {
          // Xóa khỏi danh sách đang kiểm tra
          nhiemVu.danhSachDangKiemTra = nhiemVu.danhSachDangKiemTra?.filter(
            item => item.userId !== action.payload.userId
          ) || [];

          // Thêm vào danh sách hoàn thành nếu kết quả là true
          if (action.payload.ketQua) {
            nhiemVu.danhSachHoanThanh = nhiemVu.danhSachHoanThanh || [];
            nhiemVu.danhSachHoanThanh.push({
              userId: action.payload.userId,
              thoiGian: action.payload.thoiGian,
              ketQua: action.payload.ketQua
            });
          }
        }
      })
      .addCase(hoanThanhKiemTraAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Xóa nhiệm vụ
      .addCase(xoaNhiemVuAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(xoaNhiemVuAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachNhiemVu = state.danhSachNhiemVu.filter(
          nv => nv.id !== action.payload
        );
      })
      .addCase(xoaNhiemVuAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearError, clearKiemTraHienTai } = nhiemVuSlice.actions;
export default nhiemVuSlice.reducer;