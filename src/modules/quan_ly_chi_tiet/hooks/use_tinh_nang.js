import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import tinhNangService from '../services/tinh_nang_service';
import {
  setDanhSachTinhNang,
  setTinhNangHienTai,
  setLoading,
  setError,
  themTinhNangMoi,
  capNhatTienDoPhanHe,
  xoaTinhNang as xoaTinhNangAction
} from '../store/tinh_nang_slice';

export const useTinhNang = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultState = {
    danhSachTinhNang: [],
    tinhNangHienTai: null,
    loading: false,
    error: null,
    filters: {
      phanHe: 'all',
      trangThai: 'Mới',
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

  const {
    danhSachTinhNang,
    tinhNangHienTai,
    loading,
    error,
    filters,
    thongKe
  } = useSelector((state) => state.tinhNang || defaultState);

  const layDanhSachTinhNang = useCallback(
    async (nhiemVuId) => {
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
    },
    [dispatch, toast]
  );

  const layChiTietTinhNang = useCallback(
    async (tinhNangId) => {
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
    },
    [dispatch, toast]
  );

  const themTinhNang = useCallback(
    async (tinhNangData) => {
      try {
        setIsSubmitting(true);
        const tinhNangMoi = await tinhNangService.themTinhNang(tinhNangData);
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
    },
    [dispatch, toast]
  );

  const capNhatTienDo = useCallback(
    async (tinhNangId, phanHe, tienDoData) => {
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
    },
    [dispatch, toast]
  );

  const xoaTinhNang = useCallback(
    async (tinhNangId) => {
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
    },
    [dispatch, toast]
  );

  const layTienDoTheoNgay = useCallback(
    async (nhiemVuId, startDate, endDate) => {
      try {
        dispatch(setLoading(true));
        const tienDo = await tinhNangService.getTienDoTheoNgay(nhiemVuId, startDate, endDate);
        return tienDo;
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
    },
    [dispatch, toast]
  );

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
