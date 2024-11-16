 
// File: src/modules/quan_ly_tai_chinh/hooks/use_bao_cao.js
// Link tham khảo: https://react.dev/reference/react
// Nhánh: main

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { baoCaoService } from '../services/bao_cao_service';
import {
  datThongKeTheoThang,
  datThongKeTheoLoai,
  capNhatTongQuanTaiChinh,
  datDuLieuBieuDo,
  datDangTaiDuLieu,
  datLoi,
  capNhatBoLoc
} from '../store/thong_ke_slice';

export const useBaoCao = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [dangXuLy, setDangXuLy] = useState(false);

  const {
    thongKeTheoThang,
    thongKeTheoLoai,
    tongQuanTaiChinh,
    bieuDo,
    boLoc,
    dangTaiDuLieu,
    loi
  } = useSelector(state => state.thongKe);

  const layThongKeTongQuan = useCallback(async () => {
    try {
      dispatch(datDangTaiDuLieu(true));
      const duLieu = await baoCaoService.layThongKeTongQuan(boLoc);
      dispatch(capNhatTongQuanTaiChinh(duLieu));
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
  }, [dispatch, toast, boLoc]);

  const layThongKeTheoThang = useCallback(async (thang) => {
    try {
      setDangXuLy(true);
      const duLieu = await baoCaoService.layThongKeTheoThang(thang);
      dispatch(datThongKeTheoThang(duLieu));
      return duLieu;
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

  const capNhatDuLieuBieuDo = useCallback(async () => {
    try {
      setDangXuLy(true);
      const duLieu = await baoCaoService.layDuLieuBieuDo(boLoc);
      dispatch(datDuLieuBieuDo(duLieu));
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setDangXuLy(false);
    }
  }, [dispatch, toast, boLoc]);

  return {
    thongKeTheoThang,
    thongKeTheoLoai,
    tongQuanTaiChinh,
    bieuDo,
    boLoc,
    dangTaiDuLieu,
    dangXuLy,
    loi,
    layThongKeTongQuan,
    layThongKeTheoThang,
    capNhatDuLieuBieuDo,
    capNhatBoLoc: (boLocMoi) => dispatch(capNhatBoLoc(boLocMoi))
  };
};