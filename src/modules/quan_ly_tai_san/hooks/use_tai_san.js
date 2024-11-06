// File: src/modules/quan_ly_tai_san/hooks/use_tai_san.js
// Link tham khảo: https://react.dev/reference/react/hooks
// Nhánh: main

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import * as taiSanActions from '../store/tai_san_slice';

export const useTaiSan = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const {
    danhSachTaiSan,
    selectedTaiSan,
    lichSuBaoTri,
    lichSuKiemKe,
    pagination,
    filters,
    loading,
    error
  } = useSelector((state) => state.taiSan);

  const loadDanhSachTaiSan = useCallback(async () => {
    try {
      await dispatch(taiSanActions.layDanhSachTaiSanAsync({
        filters,
        page: pagination.page
      })).unwrap();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, filters, pagination.page, toast]);

  const themTaiSan = useCallback(async (data) => {
    try {
      await dispatch(taiSanActions.themTaiSanAsync(data)).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã thêm tài sản mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const capNhatTaiSan = useCallback(async (id, data) => {
    try {
      await dispatch(taiSanActions.capNhatTaiSanAsync({ id, data })).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật tài sản',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const xoaTaiSan = useCallback(async (id) => {
    try {
      await dispatch(taiSanActions.xoaTaiSanAsync(id)).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã xóa tài sản',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const capPhatTaiSan = useCallback(async (taiSanId, data) => {
    try {
      await dispatch(taiSanActions.capPhatTaiSanAsync({
        taiSanId,
        data
      })).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã cấp phát tài sản',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const thuHoiTaiSan = useCallback(async (taiSanId, data) => {
    try {
      await dispatch(taiSanActions.thuHoiTaiSanAsync({
        taiSanId,
        data
      })).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã thu hồi tài sản',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const taoBaoTri = useCallback(async (taiSanId, data) => {
    try {
      await dispatch(taiSanActions.taoBaoTriAsync({
        taiSanId,
        data
      })).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã tạo bảo trì mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const hoanThanhBaoTri = useCallback(async (baoTriId, data) => {
    try {
      await dispatch(taiSanActions.hoanThanhBaoTriAsync({
        baoTriId,
        data
      })).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã hoàn thành bảo trì',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const taoKiemKe = useCallback(async (taiSanId, data) => {
    try {
      await dispatch(taiSanActions.taoKiemKeAsync({
        taiSanId,
        data
      })).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã tạo kiểm kê mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [dispatch, toast]);

  const loadLichSuBaoTri = useCallback(async (taiSanId) => {
    try {
      await dispatch(taiSanActions.layLichSuBaoTriAsync(taiSanId)).unwrap();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, toast]);

  const loadLichSuKiemKe = useCallback(async (taiSanId) => {
    try {
      await dispatch(taiSanActions.layLichSuKiemKeAsync(taiSanId)).unwrap();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, toast]);

  const setFilters = useCallback((newFilters) => {
    dispatch(taiSanActions.setFilters(newFilters));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(taiSanActions.clearFilters());
  }, [dispatch]);

  const setPage = useCallback((page) => {
    dispatch(taiSanActions.setPage(page));
  }, [dispatch]);

  const setSelectedTaiSan = useCallback((taiSan) => {
    dispatch(taiSanActions.setSelectedTaiSan(taiSan));
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(taiSanActions.clearError());
  }, [dispatch]);

  return {
    // State
    danhSachTaiSan,
    selectedTaiSan,
    lichSuBaoTri,
    lichSuKiemKe,
    pagination,
    filters,
    loading,
    error,

    // Actions
    loadDanhSachTaiSan,
    themTaiSan,
    capNhatTaiSan,
    xoaTaiSan,
    capPhatTaiSan,
    thuHoiTaiSan,
    taoBaoTri,
    hoanThanhBaoTri,
    taoKiemKe,
    loadLichSuBaoTri,
    loadLichSuKiemKe,

    // Helpers
    setFilters,
    clearFilters,
    setPage,
    setSelectedTaiSan,
    clearError
  };
};

export default useTaiSan; 
