import { useState, useCallback, useEffect } from 'react';
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

const defaultState = {
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

  const {
    danhSachTinhNang,
    tinhNangHienTai,
    loading,
    error,
    filters,
    thongKe
  } = useSelector((state) => state.tinhNang || defaultState);

  useEffect(() => {
    // Reset state khi unmount
    return () => {
      dispatch(setDanhSachTinhNang([]));
      dispatch(setTinhNangHienTai(null));
      dispatch(setError(null));
      dispatch(setFilters(defaultState.filters));
    };
  }, [dispatch]);

  const layDanhSachTinhNang = useCallback(async (nhiemVuId) => {
    if (!nhiemVuId) return;
    
    try {
      dispatch(setLoading(true));
      const danhSach = await tinhNangService.getDanhSachTinhNang(nhiemVuId);
      dispatch(setDanhSachTinhNang(danhSach));
    } catch (err) {
      console.error('Lỗi khi lấy danh sách tính năng:', err);
      dispatch(setError(err.message));
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách tính năng',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  const layChiTietTinhNang = useCallback(async (tinhNangId) => {
    if (!tinhNangId) return null;

    try {
      dispatch(setLoading(true));
      const tinhNang = await tinhNangService.getTinhNang(tinhNangId);
      dispatch(setTinhNangHienTai(tinhNang));
      return tinhNang;
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết tính năng:', err);
      dispatch(setError(err.message));
      toast({
        title: 'Lỗi', 
        description: 'Không thể lấy thông tin tính năng',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  const themTinhNang = useCallback(async (tinhNangData) => {
    try {
      setIsSubmitting(true);

      const docData = {
        ...tinhNangData,
        frontend: {
          nguoiPhuTrach: '',
          trangThai: 'MOI',
          tienDo: 0,
          ...(tinhNangData.frontend || {})
        },
        backend: {
          nguoiPhuTrach: '',
          trangThai: 'MOI',
          tienDo: 0,
          apiEndpoints: [],
          ...(tinhNangData.backend || {})
        },
        kiemThu: {
          nguoiPhuTrach: '',
          trangThai: 'MOI', 
          tienDo: 0,
          loaiTest: [],
          ...(tinhNangData.kiemThu || {})
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const tinhNangMoi = await tinhNangService.themTinhNang(docData);
      dispatch(themTinhNangMoi(tinhNangMoi));

      toast({
        title: 'Thành công',
        description: 'Đã thêm tính năng mới',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      return tinhNangMoi;

    } catch (err) {
      console.error('Lỗi khi thêm tính năng:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm tính năng mới',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, toast]);

  const capNhatTienDo = useCallback(async (tinhNangId, phanHe, tienDoData) => {
    if (!tinhNangId || !phanHe) return;

    try {
      setIsSubmitting(true);
      const ketQua = await tinhNangService.capNhatTienDo(tinhNangId, phanHe, tienDoData);
      dispatch(capNhatTienDoPhanHe({ tinhNangId, phanHe, tienDoData }));
      
      toast({
        title: 'Thành công',
        description: `Đã cập nhật tiến độ ${phanHe}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      return ketQua;
    } catch (err) {
      console.error('Lỗi khi cập nhật tiến độ:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật tiến độ',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, toast]);

  const xoaTinhNang = useCallback(async (tinhNangId) => {
    if (!tinhNangId) return;

    try {
      setIsSubmitting(true);
      await tinhNangService.xoaTinhNang(tinhNangId);
      dispatch(xoaTinhNangAction(tinhNangId));
      
      toast({
        title: 'Thành công',
        description: 'Đã xóa tính năng',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (err) {
      console.error('Lỗi khi xóa tính năng:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tính năng',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, toast]);

  const layTienDoTheoNgay = useCallback(async (nhiemVuId, startDate, endDate) => {
    if (!nhiemVuId || !startDate || !endDate) return [];

    try {
      dispatch(setLoading(true));
      return await tinhNangService.getTienDoTheoNgay(nhiemVuId, startDate, endDate);
    } catch (err) {
      console.error('Lỗi khi lấy tiến độ theo ngày:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy dữ liệu tiến độ',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

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