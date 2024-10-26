import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSach: [],
  loading: false,
  baoCaoHienTai: null,
  phanTrang: {
    trang: 1,
    soLuong: 10,
    tongSo: 0
  },
  boLoc: {
    tuKhoa: '',
    loaiBaoCao: '',
    phanHe: '',
    trangThai: '',
    tuNgay: null,
    denNgay: null
  },
  sapXep: {
    truong: 'ngayTao',
    huong: 'asc' // Thay đổi thành asc để phù hợp với index đã tạo
  }
};

const baoCaoSlice = createSlice({
  name: 'baoCao',
  initialState,
  reducers: {
    setDanhSach: (state, action) => {
      state.danhSach = action.payload;
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setBaoCao: (state, action) => {
      state.baoCaoHienTai = action.payload;
    },
    
    setPhanTrang: (state, action) => {
      state.phanTrang = {
        ...state.phanTrang,
        ...action.payload
      };
    },
    
    setBoLoc: (state, action) => {
      // Reset về trang 1 khi thay đổi bộ lọc
      state.phanTrang.trang = 1;
      
      state.boLoc = {
        ...state.boLoc,
        ...action.payload
      };
    },
    
    setSapXep: (state, action) => {
      state.sapXep = {
        ...state.sapXep,
        ...action.payload
      };
    },
    
    resetState: () => {
      // Sử dụng spread operator để tạo một bản sao mới của initialState
      return {
        ...initialState
      };
    }
  }
});

export const {
  setDanhSach,
  setLoading,
  setBaoCao,
  setPhanTrang,
  setBoLoc,
  setSapXep,
  resetState
} = baoCaoSlice.actions;

export default baoCaoSlice.reducer;