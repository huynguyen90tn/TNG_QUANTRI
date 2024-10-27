// src/components/quan_ly_nhiem_vu_chi_tiet/hooks/useThongKe.js
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import {
  fetchThongKeData,
  fetchTienDoChart,
  fetchThongKeNhanSu,
  fetchBaoCaoCongViec,
  clearThongKe
} from '../store/thong_ke_slice';

export const useThongKe = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    thongKeChung,
    tienDoChart,
    thongKeNhanSu,
    baoCaoCongViec
  } = useSelector((state) => state.thongKe);

  const loadThongKeChung = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      await dispatch(fetchThongKeData(params)).unwrap();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thống kê chung',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const loadTienDoChart = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      await dispatch(fetchTienDoChart(params)).unwrap();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải biểu đồ tiến độ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const loadThongKeNhanSu = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      await dispatch(fetchThongKeNhanSu(params)).unwrap();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thống kê nhân sự',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const loadBaoCaoCongViec = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      await dispatch(fetchBaoCaoCongViec(params)).unwrap();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải báo cáo công việc',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const resetThongKe = useCallback(() => {
    dispatch(clearThongKe());
  }, [dispatch]);

  return {
    // State
    loading,
    error,
    thongKeChung,
    tienDoChart,
    thongKeNhanSu,
    baoCaoCongViec,

    // Functions
    loadThongKeChung,
    loadTienDoChart,
    loadThongKeNhanSu,
    loadBaoCaoCongViec,
    resetThongKe
  };
};