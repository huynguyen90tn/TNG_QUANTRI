// Link file: src/modules/quan_ly_chi_tiet/hooks/use_tinh_nang.js

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import tinhNangService from '../services/tinh_nang_service';
import {
  setDanhSachTinhNang,
  setTinhNangHienTai,
  setLoading,
  setError,
  themTinhNangMoi,
  capNhatTienDoPhanHe,
  xoaTinhNang as xoaTinhNangAction,
  setFilters
} from '../store/tinh_nang_slice';

const DEFAULT_STATE = {
  danhSachTinhNang: [],
  tinhNangHienTai: null,
  loading: false,
  error: null,
  filters: {
    phanHe: 'all',
    trangThai: 'MOI',
    nguoiPhuTrach: 'all',
    search: ''
  },
  thongKe: {
    tongSoTinhNang: 0,
    daHoanThanh: 0,
    dangThucHien: 0,
    chuaBatDau: 0,
    tienDoTrungBinh: 0
  }
};

export const useTinhNang = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = useSelector((state) => state.tinhNang || DEFAULT_STATE);
  const {
    danhSachTinhNang,
    tinhNangHienTai,
    loading,
    error,
    filters,
    thongKe
  } = state;

  const clearStateOnUnmount = useCallback(() => {
    dispatch(setDanhSachTinhNang([]));
    dispatch(setTinhNangHienTai(null));
    dispatch(setError(null));
    dispatch(setFilters(DEFAULT_STATE.filters));
  }, [dispatch]);

  useEffect(() => {
    return clearStateOnUnmount;
  }, [clearStateOnUnmount]);

  const showErrorToast = useCallback((message) => {
    toast({
      title: 'Lỗi',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true
    });
  }, [toast]);

  const showSuccessToast = useCallback((message) => {
    toast({
      title: 'Thành công',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  }, [toast]);

  const layDanhSachTinhNang = useCallback(async (nhiemVuId) => {
    if (!nhiemVuId) return;
    
    try {
      dispatch(setLoading(true));
      const danhSach = await tinhNangService.getDanhSachTinhNang(nhiemVuId);
      dispatch(setDanhSachTinhNang(danhSach));
    } catch (err) {
      const errorMessage = 'Không thể lấy danh sách tính năng';
      console.error(errorMessage, err);
      dispatch(setError(err.message));
      showErrorToast(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, showErrorToast]);

  const layChiTietTinhNang = useCallback(async (tinhNangId) => {
    if (!tinhNangId) return null;

    try {
      dispatch(setLoading(true));
      const tinhNang = await tinhNangService.getTinhNang(tinhNangId);
      dispatch(setTinhNangHienTai(tinhNang));
      return tinhNang;
    } catch (err) {
      const errorMessage = 'Không thể lấy thông tin tính năng';
      console.error(errorMessage, err);
      dispatch(setError(err.message));
      showErrorToast(errorMessage);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, showErrorToast]);

  const initializePhanHe = useMemo(() => ({
    nguoiPhuTrach: '',
    trangThai: 'MOI',
    tienDo: 0
  }), []);

  const themTinhNang = useCallback(async (tinhNangData) => {
    try {
      setIsSubmitting(true);

      const docData = {
        ...tinhNangData,
        frontend: {
          ...initializePhanHe,
          ...(tinhNangData.frontend || {})
        },
        backend: {
          ...initializePhanHe,
          apiEndpoints: [],
          ...(tinhNangData.backend || {})
        },
        kiemThu: {
          ...initializePhanHe,
          loaiTest: [],
          ...(tinhNangData.kiemThu || {})
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const tinhNangMoi = await tinhNangService.themTinhNang(docData);
      dispatch(themTinhNangMoi(tinhNangMoi));
      showSuccessToast('Đã thêm tính năng mới');
      return tinhNangMoi;
    } catch (err) {
      const errorMessage = 'Không thể thêm tính năng mới';
      console.error(errorMessage, err);
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, initializePhanHe, showSuccessToast, showErrorToast]);

  const capNhatTienDo = useCallback(async (tinhNangId, phanHe, tienDoData) => {
    if (!tinhNangId || !phanHe) return;

    try {
      setIsSubmitting(true);
      const ketQua = await tinhNangService.capNhatTienDo(tinhNangId, phanHe, tienDoData);
      dispatch(capNhatTienDoPhanHe({ tinhNangId, phanHe, tienDoData }));
      showSuccessToast(`Đã cập nhật tiến độ ${phanHe}`);
      return ketQua;
    } catch (err) {
      const errorMessage = 'Không thể cập nhật tiến độ';
      console.error(errorMessage, err);
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, showSuccessToast, showErrorToast]);

  const xoaTinhNang = useCallback(async (tinhNangId) => {
    if (!tinhNangId) return;

    try {
      setIsSubmitting(true);
      await tinhNangService.xoaTinhNang(tinhNangId);
      dispatch(xoaTinhNangAction(tinhNangId));
      showSuccessToast('Đã xóa tính năng');
    } catch (err) {
      const errorMessage = 'Không thể xóa tính năng';
      console.error(errorMessage, err);
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, showSuccessToast, showErrorToast]);

  const layTienDoTheoNgay = useCallback(async (nhiemVuId, startDate, endDate) => {
    if (!nhiemVuId || !startDate || !endDate) return [];

    try {
      dispatch(setLoading(true));
      return await tinhNangService.getTienDoTheoNgay(nhiemVuId, startDate, endDate);
    } catch (err) {
      const errorMessage = 'Không thể lấy dữ liệu tiến độ';
      console.error(errorMessage, err);
      showErrorToast(errorMessage);
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, showErrorToast]);

  return {
    danhSachTinhNang,
    tinhNangHienTai,
    loading,
    error,
    isSubmitting,
    filters,
    thongKe,
    layDanhSachTinhNang,
    layChiTietTinhNang,
    themTinhNang,
    capNhatTienDo,
    xoaTinhNang,
    layTienDoTheoNgay
  };
};

export default useTinhNang;