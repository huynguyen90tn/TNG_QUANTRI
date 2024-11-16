// File: src/modules/quan_ly_tai_chinh/hooks/use_nguon_thu.js
// Link tham khảo: https://react.dev/reference/react
// Nhánh: main

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { 
  themNguonThu,
  capNhatNguonThu,
  xoaNguonThu,
  datDanhSachNguonThu,
  datNguonThuHienTai,
  datDangTaiDuLieu,
  datLoi,
  capNhatBoLoc,
  capNhatPhanTrang
} from '../store/nguon_thu_slice';

const initialState = {
  danhSachNguonThu: [],
  nguonThuHienTai: null,
  boLoc: {
    tuNgay: null,
    denNgay: null,
    loaiThu: 'TAT_CA',
    trangThai: 'TAT_CA'
  },
  phanTrang: {
    trang: 1,
    soLuong: 10,
    tongSo: 0
  },
  dangTaiDuLieu: false,
  loi: null
};

export const useNguonThu = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [dangXuLy, setDangXuLy] = useState(false);

  const state = useSelector((state) => state.nguonThu) || initialState;

  const {
    danhSachNguonThu = [],
    nguonThuHienTai,
    boLoc = initialState.boLoc,
    phanTrang = initialState.phanTrang,
    dangTaiDuLieu = false,
    loi
  } = state;

  const layDanhSachNguonThu = useCallback(async () => {
    try {
      dispatch(datDangTaiDuLieu(true));
      // Implement API call here
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      dispatch(datLoi(error.message));
    } finally {
      dispatch(datDangTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  return {
    danhSachNguonThu,
    nguonThuHienTai,
    boLoc,
    phanTrang,
    dangTaiDuLieu,
    dangXuLy,
    loi,
    layDanhSachNguonThu,
    themNguonThuAction: (nguonThu) => dispatch(themNguonThu(nguonThu)),
    capNhatNguonThuAction: (nguonThu) => dispatch(capNhatNguonThu(nguonThu)), 
    xoaNguonThuAction: (id) => dispatch(xoaNguonThu(id)),
    datNguonThuHienTai: (nguonThu) => dispatch(datNguonThuHienTai(nguonThu)),
    capNhatBoLoc: (boLocMoi) => dispatch(capNhatBoLoc(boLocMoi)),
    capNhatPhanTrang: (phanTrangMoi) => dispatch(capNhatPhanTrang(phanTrangMoi))
  };
};