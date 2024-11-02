// src/modules/quan_ly_thanh_vien/store/thanh_vien_slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { thanhVienService } from '../services/thanh_vien_service';

export const layDanhSachThanhVien = createAsyncThunk(
  'thanhVien/layDanhSach',
  async (_, { rejectWithValue }) => {
    try {
      const response = await thanhVienService.layDanhSach();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const themThanhVien = createAsyncThunk(
  'thanhVien/them',
  async (data, { rejectWithValue }) => {
    try {
      const response = await thanhVienService.them(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const capNhatThanhVien = createAsyncThunk(
  'thanhVien/capNhat',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await thanhVienService.capNhat(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const capNhatTrangThaiThanhVien = createAsyncThunk(
  'thanhVien/capNhatTrangThai',
  async ({ id, trangThai }, { rejectWithValue }) => {
    try {
      const response = await thanhVienService.capNhatTrangThai(id, trangThai);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const xoaThanhVien = createAsyncThunk(
  'thanhVien/xoa',
  async (id, { rejectWithValue }) => {
    try {
      await thanhVienService.xoa(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  danhSach: [],
  danhSachLoc: [],
  dangTai: false,
  loi: null,
  thongBao: null,
  boLoc: {
    tuKhoa: '',
    phongBan: '',
    chucVu: '',
    trangThai: '',
  },
};

const thanhVienSlice = createSlice({
  name: 'thanhVien',
  initialState,
  reducers: {
    datLaiLoi: (state) => {
      state.loi = null;
    },
    datLaiThongBao: (state) => {
      state.thongBao = null;
    },
    capNhatBoLoc: (state, action) => {
      state.boLoc = { ...state.boLoc, ...action.payload };
    },
    apDungBoLoc: (state) => {
      const { tuKhoa, phongBan, chucVu, trangThai } = state.boLoc;
      
      state.danhSachLoc = state.danhSach.filter(thanhVien => {
        const matchTuKhoa = !tuKhoa || 
          thanhVien.hoTen.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          thanhVien.email.toLowerCase().includes(tuKhoa.toLowerCase());

        const matchPhongBan = !phongBan || thanhVien.phongBan === phongBan;
        const matchChucVu = !chucVu || thanhVien.chucVu === chucVu;
        const matchTrangThai = !trangThai || thanhVien.trangThai === trangThai;

        return matchTuKhoa && matchPhongBan && matchChucVu && matchTrangThai;
      });
    },
    datLaiBoLoc: (state) => {
      state.boLoc = initialState.boLoc;
      state.danhSachLoc = state.danhSach;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách
      .addCase(layDanhSachThanhVien.pending, (state) => {
        state.dangTai = true;
        state.loi = null;
      })
      .addCase(layDanhSachThanhVien.fulfilled, (state, action) => {
        state.dangTai = false;
        state.danhSach = action.payload;
        state.danhSachLoc = action.payload;
      })
      .addCase(layDanhSachThanhVien.rejected, (state, action) => {
        state.dangTai = false;
        state.loi = action.payload;
      })
      
      // Thêm thành viên
      .addCase(themThanhVien.fulfilled, (state, action) => {
        state.danhSach.push(action.payload);
        state.thongBao = 'Thêm thành viên thành công';
      })
      .addCase(themThanhVien.rejected, (state, action) => {
        state.loi = action.payload;
      })

      // Cập nhật thành viên
      .addCase(capNhatThanhVien.fulfilled, (state, action) => {
        const index = state.danhSach.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.danhSach[index] = action.payload;
        }
        state.thongBao = 'Cập nhật thành viên thành công';
      })
      .addCase(capNhatThanhVien.rejected, (state, action) => {
        state.loi = action.payload;
      })

      // Cập nhật trạng thái
      .addCase(capNhatTrangThaiThanhVien.fulfilled, (state, action) => {
        const index = state.danhSach.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.danhSach[index].trangThai = action.payload.trangThai;
        }
        state.thongBao = 'Cập nhật trạng thái thành công';
      })
      .addCase(capNhatTrangThaiThanhVien.rejected, (state, action) => {
        state.loi = action.payload;
      })

      // Xóa thành viên
      .addCase(xoaThanhVien.fulfilled, (state, action) => {
        state.danhSach = state.danhSach.filter(item => item.id !== action.payload);
        state.thongBao = 'Xóa thành viên thành công';
      })
      .addCase(xoaThanhVien.rejected, (state, action) => {
        state.loi = action.payload;
      });
  },
});

export const {
  datLaiLoi,
  datLaiThongBao,
  capNhatBoLoc,
  apDungBoLoc,
  datLaiBoLoc,
} = thanhVienSlice.actions;

export default thanhVienSlice.reducer;