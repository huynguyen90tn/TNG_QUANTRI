 
// File: src/modules/quan_ly_tai_san/store/tai_san_slice.js
// Link tham khảo: https://redux-toolkit.js.org/api/createSlice
// Link tham khảo: https://redux-toolkit.js.org/api/createAsyncThunk
// Nhánh: main

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taiSanService from '../services/tai_san_service';

// Async Thunks
export const layDanhSachTaiSanAsync = createAsyncThunk(
  'taiSan/layDanhSach',
  async ({ filters = {}, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await taiSanService.layDanhSachTaiSan(filters, page);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const themTaiSanAsync = createAsyncThunk(
  'taiSan/themMoi',
  async (taiSanData, { rejectWithValue }) => {
    try {
      const response = await taiSanService.themTaiSan(taiSanData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const capNhatTaiSanAsync = createAsyncThunk(
  'taiSan/capNhat',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await taiSanService.capNhatTaiSan(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const xoaTaiSanAsync = createAsyncThunk(
  'taiSan/xoa',
  async (id, { rejectWithValue }) => {
    try {
      await taiSanService.xoaTaiSan(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const capPhatTaiSanAsync = createAsyncThunk(
  'taiSan/capPhat',
  async ({ taiSanId, data }, { rejectWithValue }) => {
    try {
      const response = await taiSanService.capPhatTaiSan(taiSanId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const thuHoiTaiSanAsync = createAsyncThunk(
  'taiSan/thuHoi',
  async ({ taiSanId, data }, { rejectWithValue }) => {
    try {
      const response = await taiSanService.thuHoiTaiSan(taiSanId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const taoBaoTriAsync = createAsyncThunk(
  'taiSan/taoBaoTri',
  async ({ taiSanId, data }, { rejectWithValue }) => {
    try {
      const response = await taiSanService.taoBaoTriTaiSan(taiSanId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const hoanThanhBaoTriAsync = createAsyncThunk(
  'taiSan/hoanThanhBaoTri',
  async ({ baoTriId, data }, { rejectWithValue }) => {
    try {
      const response = await taiSanService.hoanThanhBaoTri(baoTriId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const taoKiemKeAsync = createAsyncThunk(
  'taiSan/taoKiemKe',
  async ({ taiSanId, data }, { rejectWithValue }) => {
    try {
      const response = await taiSanService.taoKiemKeTaiSan(taiSanId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const layLichSuBaoTriAsync = createAsyncThunk(
  'taiSan/layLichSuBaoTri',
  async (taiSanId, { rejectWithValue }) => {
    try {
      const response = await taiSanService.layLichSuBaoTri(taiSanId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const layLichSuKiemKeAsync = createAsyncThunk(
  'taiSan/layLichSuKiemKe',
  async (taiSanId, { rejectWithValue }) => {
    try {
      const response = await taiSanService.layLichSuKiemKe(taiSanId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  danhSachTaiSan: [],
  selectedTaiSan: null,
  lichSuBaoTri: [],
  lichSuKiemKe: [],
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0
  },
  filters: {
    loaiTaiSan: '',
    nhomTaiSan: '',
    trangThai: '',
    phongBan: '',
    searchText: ''
  },
  loading: false,
  error: null
};

// Slice
const taiSanSlice = createSlice({
  name: 'taiSan',
  initialState,
  reducers: {
    setSelectedTaiSan: (state, action) => {
      state.selectedTaiSan = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
      // Reset về trang 1 khi thay đổi filter
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách tài sản
      .addCase(layDanhSachTaiSanAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(layDanhSachTaiSanAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachTaiSan = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalItems: action.payload.totalItems,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(layDanhSachTaiSanAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Thêm tài sản mới
      .addCase(themTaiSanAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(themTaiSanAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachTaiSan.unshift(action.payload);
      })
      .addCase(themTaiSanAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cập nhật tài sản
      .addCase(capNhatTaiSanAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(capNhatTaiSanAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.danhSachTaiSan.findIndex(
          item => item.id === action.payload.id
        );
        if (index !== -1) {
          state.danhSachTaiSan[index] = action.payload;
        }
        // Nếu đang chọn tài sản này thì cập nhật luôn
        if (state.selectedTaiSan?.id === action.payload.id) {
          state.selectedTaiSan = action.payload;
        }
      })
      .addCase(capNhatTaiSanAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xóa tài sản
      .addCase(xoaTaiSanAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(xoaTaiSanAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSachTaiSan = state.danhSachTaiSan.filter(
          item => item.id !== action.payload
        );
        if (state.selectedTaiSan?.id === action.payload) {
          state.selectedTaiSan = null;
        }
      })
      .addCase(xoaTaiSanAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cấp phát tài sản
      .addCase(capPhatTaiSanAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(capPhatTaiSanAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.danhSachTaiSan.findIndex(
          item => item.id === action.payload.id
        );
        if (index !== -1) {
          state.danhSachTaiSan[index] = action.payload;
        }
        if (state.selectedTaiSan?.id === action.payload.id) {
          state.selectedTaiSan = action.payload;
        }
      })
      .addCase(capPhatTaiSanAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Thu hồi tài sản
      .addCase(thuHoiTaiSanAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thuHoiTaiSanAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.danhSachTaiSan.findIndex(
          item => item.id === action.payload.id
        );
        if (index !== -1) {
          state.danhSachTaiSan[index] = action.payload;
        }
        if (state.selectedTaiSan?.id === action.payload.id) {
          state.selectedTaiSan = action.payload;
        }
      })
      .addCase(thuHoiTaiSanAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Tạo bảo trì
      .addCase(taoBaoTriAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taoBaoTriAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lichSuBaoTri.unshift(action.payload);
        // Cập nhật trạng thái tài sản nếu có
        const index = state.danhSachTaiSan.findIndex(
          item => item.id === action.payload.taiSanId
        );
        if (index !== -1) {
          state.danhSachTaiSan[index].trangThai = 'dang_bao_tri';
        }
      })
      .addCase(taoBaoTriAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Hoàn thành bảo trì
      .addCase(hoanThanhBaoTriAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hoanThanhBaoTriAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lichSuBaoTri.findIndex(
          item => item.id === action.payload.id
        );
        if (index !== -1) {
          state.lichSuBaoTri[index] = action.payload;
        }
      })
      .addCase(hoanThanhBaoTriAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Tạo kiểm kê
      .addCase(taoKiemKeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taoKiemKeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lichSuKiemKe.unshift(action.payload);
      })
      .addCase(taoKiemKeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Lấy lịch sử bảo trì
      .addCase(layLichSuBaoTriAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(layLichSuBaoTriAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lichSuBaoTri = action.payload;
      })
      .addCase(layLichSuBaoTriAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Lấy lịch sử kiểm kê
      .addCase(layLichSuKiemKeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(layLichSuKiemKeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lichSuKiemKe = action.payload;
      })
      .addCase(layLichSuKiemKeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
    setSelectedTaiSan,
    setFilters,
    clearFilters,
    setPage,
    clearError
  } = taiSanSlice.actions;
  
  // Selectors
  export const selectDanhSachTaiSan = (state) => state.taiSan.danhSachTaiSan;
  export const selectSelectedTaiSan = (state) => state.taiSan.selectedTaiSan;
  export const selectLichSuBaoTri = (state) => state.taiSan.lichSuBaoTri;
  export const selectLichSuKiemKe = (state) => state.taiSan.lichSuKiemKe;
  export const selectPagination = (state) => state.taiSan.pagination;
  export const selectFilters = (state) => state.taiSan.filters;
  export const selectLoading = (state) => state.taiSan.loading;
  export const selectError = (state) => state.taiSan.error;
  
  export default taiSanSlice.reducer;