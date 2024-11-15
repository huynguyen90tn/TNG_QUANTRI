// File: src/modules/quan_ly_luong/hooks/use_luong.js  
// Link tham khảo: https://react.dev/reference/react/useCallback
// Nhánh: main

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import {
  layDanhSachLuong,
  layLuongNhanVien,
  taoMoiBangLuong, 
  capNhatBangLuong,
  xoaLuongHienTai,
  capNhatTongLuong,
  themLuongVaoDanhSach,
  capNhatLuongTrongDanhSach
} from '../store/luong_slice';
import { BAO_HIEM, MUC_THUE, LUONG_THEO_CAP_BAC } from '../constants/loai_luong';

/**
 * Tính thuế thu nhập cá nhân
 */
const tinhThueTNCN = (thuNhapChiuThue, dongThue = true) => {
  if (!dongThue || !thuNhapChiuThue) return 0;

  try {
    let thueTNCN = 0;
    let thuNhapConLai = thuNhapChiuThue;
    let mucTruocDo = 0;

    for (const { muc, tiLe } of MUC_THUE) {
      const phanThuNhap = Math.min(thuNhapConLai, muc - mucTruocDo);
      if (phanThuNhap <= 0) break;

      thueTNCN += phanThuNhap * tiLe;
      thuNhapConLai -= phanThuNhap;
      mucTruocDo = muc;
    }

    return Math.round(thueTNCN);
  } catch (error) {
    console.error('Lỗi tính thuế TNCN:', error);
    return 0;
  }
};

const tinhLuongCoBan = (level) => {
  if (!level) return 0;
  const baseSalary = LUONG_THEO_CAP_BAC[level.toUpperCase()] || 0;
  return Math.round(baseSalary / 26); // 26 ngày làm việc/tháng
};

export const useLuong = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { 
    danhSachLuong,
    luongHienTai,
    loading,
    error 
  } = useSelector((state) => ({
    danhSachLuong: state.luong?.danhSachLuong || [],
    luongHienTai: state.luong?.luongHienTai || null,
    loading: state.luong?.loading || false,
    error: state.luong?.error || null
  }));

  const tinhBaoHiem = useCallback((luongCoBan, dongBaoHiem = true) => {
    if (!dongBaoHiem || !luongCoBan) {
      return { bhyt: 0, bhxh: 0, bhtn: 0 };
    }

    try {
      return {
        bhyt: Math.round(luongCoBan * BAO_HIEM.BHYT),
        bhxh: Math.round(luongCoBan * BAO_HIEM.BHXH),
        bhtn: Math.round(luongCoBan * BAO_HIEM.BHTN)
      };
    } catch (error) {
      console.error('Lỗi tính bảo hiểm:', error);
      return { bhyt: 0, bhxh: 0, bhtn: 0 };
    }
  }, []);

  const tinhToanLuong = useCallback((
    luongCoBan,
    thuongPhat = 0,
    phuCap = {},
    dongBaoHiem = true, 
    dongThue = true,
    khauTru = { nghiPhepKhongPhep: 0 },
    level = ''
  ) => {
    try {
      // Tính lương cơ bản mới theo 26 ngày
      const luongCoBanMoi = level ? tinhLuongCoBan(level) : luongCoBan;

      const tongPhuCap = Object.values(phuCap || {})
        .reduce((sum, val) => sum + (val || 0), 0);

      // Trừ tiền nghỉ phép không phép vào thu nhập  
      const tongThuNhap = (luongCoBanMoi || 0) + 
        tongPhuCap + 
        (thuongPhat || 0) - 
        (khauTru?.nghiPhepKhongPhep || 0);

      const baoHiem = tinhBaoHiem(luongCoBanMoi, dongBaoHiem);
      const tongBaoHiem = dongBaoHiem ? 
        (baoHiem.bhyt + baoHiem.bhxh + baoHiem.bhtn) : 0;

      // Thu nhập tính thuế là thu nhập sau khi trừ bảo hiểm
      const thuNhapTinhThue = tongThuNhap - (dongBaoHiem ? tongBaoHiem : 0);
      const thueTNCN = tinhThueTNCN(thuNhapTinhThue, dongThue);

      // Thực lĩnh = Tổng thu nhập - bảo hiểm - thuế
      const thucLinh = Math.max(0, tongThuNhap -
        (dongBaoHiem ? tongBaoHiem : 0) -
        (dongThue ? thueTNCN : 0)
      );

      return {
        tongThuNhap,
        thueTNCN,
        baoHiem,
        thucLinh,
        khauTru,
        luongCoBan: luongCoBanMoi
      };
    } catch (error) {
      console.error('Lỗi tính toán lương:', error);
      throw new Error('Không thể tính toán lương: ' + error.message); 
    }
  }, [tinhBaoHiem]);

  const layDanhSach = useCallback(async () => {
    try {
      const resultAction = await dispatch(layDanhSachLuong()).unwrap();
      dispatch(capNhatTongLuong());
      return resultAction;
    } catch (error) {
      console.error('Lỗi lấy danh sách lương:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách lương',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    }
  }, [dispatch, toast]);

  const layLuongCaNhan = useCallback(async (userId) => {
    if (!userId) return;
    try {
      await dispatch(layLuongNhanVien(userId)).unwrap();
    } catch (error) {
      console.error('Lỗi lấy lương cá nhân:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải thông tin lương',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    }
  }, [dispatch, toast]);

  const taoMoi = useCallback(async (data) => {
    try {
      const resultAction = await dispatch(taoMoiBangLuong(data)).unwrap();
      dispatch(themLuongVaoDanhSach(resultAction));
      dispatch(capNhatTongLuong());
      
      toast({
        title: 'Thành công',
        description: 'Đã tạo mới bảng lương',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      return resultAction;
    } catch (error) {
      console.error('Lỗi tạo mới lương:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo bảng lương',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    }
  }, [dispatch, toast]);

  const capNhat = useCallback(async (id, data) => {
    try {
      const resultAction = await dispatch(capNhatBangLuong({ id, data })).unwrap();
      dispatch(capNhatLuongTrongDanhSach(resultAction));
      dispatch(capNhatTongLuong());

      toast({
        title: 'Thành công', 
        description: 'Đã cập nhật bảng lương',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      return resultAction;
    } catch (error) {
      console.error('Lỗi cập nhật lương:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật bảng lương', 
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    }
  }, [dispatch, toast]);

  const xoaLuong = useCallback(() => {
    dispatch(xoaLuongHienTai());
  }, [dispatch]);

  const lamMoi = useCallback(async () => {
    await layDanhSach();
  }, [layDanhSach]);

  return {
    danhSachLuong,
    luongHienTai,
    loading,
    error,
    layDanhSach,
    layLuongCaNhan,
    tinhToanLuong,
    taoMoi,
    capNhat,
    xoaLuong,
    lamMoi,
    tinhLuongCoBan
  };
};

export default useLuong;