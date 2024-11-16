// File: src/modules/quan_ly_tai_chinh/hooks/use_tai_chinh.js
// Link tham khảo: https://react.dev/reference/react/hooks
// Nhánh: main

import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { taiChinhService } from '../services/tai_chinh_service';
import {
  themNguonThu,
  themChiTieu,
  capNhatNguonThu,
  capNhatChiTieu,
  xoaNguonThu,
  xoaChiTieu,
  datTrangThaiTaiDuLieu,
  datLoi,
  capNhatBoLoc,
  capNhatPhanTrang,
  resetTrangThai
} from '../store/tai_chinh_slice';

export const useTaiChinh = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [dangXuLy, setDangXuLy] = useState(false);

  const taiChinhState = useSelector((state) => state.taiChinh);

  useEffect(() => {
    if (!taiChinhState) {
      dispatch(resetTrangThai());
    }
  }, [dispatch, taiChinhState]);

  const {
    nguonThu = [],
    chiTieu = [],
    tonKho = 0,
    boLoc = {
      tuNgay: null,  
      denNgay: null,
      loaiThu: 'TAT_CA',
      loaiChi: 'TAT_CA'
    },
    phanTrang = {
      trang: 1,
      soLuong: 10,
      tongSo: 0
    },
    dangTaiDuLieu = false,
    loi = null
  } = taiChinhState || {};

  const themMoiNguonThu = useCallback(async (duLieu) => {
    try {
      setDangXuLy(true);
      dispatch(datTrangThaiTaiDuLieu(true));
      
      const nguonThuMoi = await taiChinhService.themNguonThu({
        ...duLieu,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString()
      });
      
      dispatch(themNguonThu(nguonThuMoi));
      
      toast({
        title: 'Thêm nguồn thu thành công',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      return nguonThuMoi;
    } catch (error) {
      toast({
        title: 'Lỗi khi thêm nguồn thu',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      dispatch(datLoi(error.message));
      throw error;
    } finally {
      setDangXuLy(false);
      dispatch(datTrangThaiTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const themMoiChiTieu = useCallback(async (duLieu) => {
    try {
      setDangXuLy(true);
      dispatch(datTrangThaiTaiDuLieu(true));
      
      const chiTieuMoi = await taiChinhService.themChiTieu({
        ...duLieu,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString()
      });
      
      dispatch(themChiTieu(chiTieuMoi));
      
      toast({
        title: 'Thêm chi tiêu thành công',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      return chiTieuMoi;
    } catch (error) {
      toast({
        title: 'Lỗi khi thêm chi tiêu',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      dispatch(datLoi(error.message));
      throw error; 
    } finally {
      setDangXuLy(false);
      dispatch(datTrangThaiTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const capNhatThongTinNguonThu = useCallback(async (id, duLieu) => {
    try {
      setDangXuLy(true);
      dispatch(datTrangThaiTaiDuLieu(true));
      
      const nguonThuCapNhat = await taiChinhService.capNhatNguonThu(id, {
        ...duLieu,
        ngayCapNhat: new Date().toISOString()
      });
      
      dispatch(capNhatNguonThu(nguonThuCapNhat));
      
      toast({
        title: 'Cập nhật nguồn thu thành công',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      return nguonThuCapNhat;
    } catch (error) {
      toast({
        title: 'Lỗi khi cập nhật nguồn thu',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true 
      });
      dispatch(datLoi(error.message));
      throw error;
    } finally {
      setDangXuLy(false); 
      dispatch(datTrangThaiTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const capNhatThongTinChiTieu = useCallback(async (id, duLieu) => {
    try {
      setDangXuLy(true);
      dispatch(datTrangThaiTaiDuLieu(true));
      
      const chiTieuCapNhat = await taiChinhService.capNhatChiTieu(id, {
        ...duLieu,
        ngayCapNhat: new Date().toISOString()
      });
      
      dispatch(capNhatChiTieu(chiTieuCapNhat));
      
      toast({
        title: 'Cập nhật chi tiêu thành công', 
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      return chiTieuCapNhat;
    } catch (error) {
      toast({
        title: 'Lỗi khi cập nhật chi tiêu',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      dispatch(datLoi(error.message));
      throw error;
    } finally {
      setDangXuLy(false);
      dispatch(datTrangThaiTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const xoaThongTinNguonThu = useCallback(async (id) => {
    try {
      setDangXuLy(true);
      dispatch(datTrangThaiTaiDuLieu(true));
      
      await taiChinhService.xoaNguonThu(id);
      dispatch(xoaNguonThu(id));
      
      toast({
        title: 'Xóa nguồn thu thành công',
        status: 'success', 
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Lỗi khi xóa nguồn thu',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      dispatch(datLoi(error.message));
      throw error;
    } finally {
      setDangXuLy(false);
      dispatch(datTrangThaiTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const xoaThongTinChiTieu = useCallback(async (id) => {
    try {
      setDangXuLy(true);
      dispatch(datTrangThaiTaiDuLieu(true));
      
      await taiChinhService.xoaChiTieu(id);
      dispatch(xoaChiTieu(id));
      
      toast({
        title: 'Xóa chi tiêu thành công',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Lỗi khi xóa chi tiêu',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      dispatch(datLoi(error.message));
      throw error;
    } finally {
      setDangXuLy(false);
      dispatch(datTrangThaiTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const layTongQuanTaiChinh = useCallback(async () => {
    try {
      dispatch(datTrangThaiTaiDuLieu(true));
      const tongQuan = await taiChinhService.layTongQuanTaiChinh();
      dispatch(datLoi(null));
      return tongQuan;
    } catch (error) {
      dispatch(datLoi(error.message));
      toast({
        title: 'Lỗi khi lấy tổng quan tài chính',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    } finally {
      dispatch(datTrangThaiTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  return {
    // State
    nguonThu,
    chiTieu, 
    tonKho,
    boLoc,
    phanTrang,
    dangTaiDuLieu,
    dangXuLy,
    loi,

    // Actions
    themMoiNguonThu,
    themMoiChiTieu,
    capNhatThongTinNguonThu,
    capNhatThongTinChiTieu,
    xoaThongTinNguonThu,
    xoaThongTinChiTieu,
    layTongQuanTaiChinh,

    // Dispatchers
    capNhatBoLoc: useCallback((boLocMoi) => dispatch(capNhatBoLoc(boLocMoi)), [dispatch]),
    capNhatPhanTrang: useCallback((phanTrangMoi) => dispatch(capNhatPhanTrang(phanTrangMoi)), [dispatch]),
    datTrangThaiTaiDuLieu: useCallback((trangThai) => dispatch(datTrangThaiTaiDuLieu(trangThai)), [dispatch]),
    datLoi: useCallback((loi) => dispatch(datLoi(loi)), [dispatch])
  };
};

export default useTaiChinh;