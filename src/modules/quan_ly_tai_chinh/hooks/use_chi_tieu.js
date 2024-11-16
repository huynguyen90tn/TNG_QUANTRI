 
// File: src/modules/quan_ly_tai_chinh/hooks/use_chi_tieu.js
// Link tham khảo: https://react.dev/reference/react
// Nhánh: main

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { chiTieuService } from '../services/chi_tieu_service';
import {
  themChiTieu,
  capNhatChiTieu,
  xoaChiTieu,
  datDanhSachChiTieu,
  datChiTieuHienTai,
  datDangTaiDuLieu,
  datLoi,
  capNhatBoLoc,
  capNhatPhanTrang
} from '../store/chi_tieu_slice';

export const useChiTieu = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [dangXuLy, setDangXuLy] = useState(false);

  const {
    danhSachChiTieu,
    chiTieuHienTai,
    boLoc,
    phanTrang,
    dangTaiDuLieu,
    loi
  } = useSelector(state => state.chiTieu);

  const layDanhSachChiTieu = useCallback(async () => {
    try {
      dispatch(datDangTaiDuLieu(true));
      const response = await chiTieuService.layDanhSachChiTieu({
        ...boLoc,
        ...phanTrang
      });
      dispatch(datDanhSachChiTieu(response.danhSach));
      dispatch(capNhatPhanTrang({
        tongSo: response.tongSo
      }));
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
  }, [dispatch, toast, boLoc, phanTrang]);

  const themMoiChiTieu = useCallback(async (duLieu) => {
    try {
      setDangXuLy(true);
      const chiTieuMoi = await chiTieuService.themChiTieu(duLieu);
      dispatch(themChiTieu(chiTieuMoi));
      toast({
        title: 'Thành công',
        description: 'Thêm chi tiêu mới thành công',
        status: 'success',
        duration: 3000
      });
      return chiTieuMoi;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  }, [dispatch, toast]);

  const capNhatThongTinChiTieu = useCallback(async (id, duLieu) => {
    try {
      setDangXuLy(true);
      const chiTieuCapNhat = await chiTieuService.capNhatChiTieu(id, duLieu);
      dispatch(capNhatChiTieu(chiTieuCapNhat));
      toast({
        title: 'Thành công',
        description: 'Cập nhật chi tiêu thành công',
        status: 'success',
        duration: 3000
      });
      return chiTieuCapNhat;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  }, [dispatch, toast]);

  const xoaThongTinChiTieu = useCallback(async (id) => {
    try {
      setDangXuLy(true);
      await chiTieuService.xoaChiTieu(id);
      dispatch(xoaChiTieu(id));
      toast({
        title: 'Thành công',
        description: 'Xóa chi tiêu thành công',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  }, [dispatch, toast]);

  return {
    danhSachChiTieu,
    chiTieuHienTai,
    boLoc,
    phanTrang,
    dangTaiDuLieu,
    dangXuLy,
    loi,
    layDanhSachChiTieu,
    themMoiChiTieu,
    capNhatThongTinChiTieu,
    xoaThongTinChiTieu,
    datChiTieuHienTai: (chiTieu) => dispatch(datChiTieuHienTai(chiTieu)),
    capNhatBoLoc: (boLocMoi) => dispatch(capNhatBoLoc(boLocMoi)),
    capNhatPhanTrang: (phanTrangMoi) => dispatch(capNhatPhanTrang(phanTrangMoi))
  };
};