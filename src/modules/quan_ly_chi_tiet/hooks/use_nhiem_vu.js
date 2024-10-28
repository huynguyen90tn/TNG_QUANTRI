import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import nhiemVuService from '../services/nhiem_vu_service';
import {
  setDanhSachNhiemVu,
  setNhiemVuHienTai,
  setLoading,
  setError
} from '../store/nhiem_vu_slice';

export const useNhiemVu = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    danhSachNhiemVu,
    nhiemVuHienTai,
    loading,
    error
  } = useSelector((state) => state.nhiemVu);

  const layDanhSachNhiemVu = useCallback(async (duAnId) => {
    try {
      dispatch(setLoading(true));
      const danhSach = await nhiemVuService.getDanhSachNhiemVu(duAnId);
      dispatch(setDanhSachNhiemVu(danhSach));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhiệm vụ:', error);
      dispatch(setError(error.message));
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  const layChiTietNhiemVu = useCallback(async (nhiemVuId) => {
    try {
      dispatch(setLoading(true));
      const nhiemVu = await nhiemVuService.getNhiemVu(nhiemVuId);
      dispatch(setNhiemVuHienTai(nhiemVu));
      return nhiemVu;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết nhiệm vụ:', error);
      dispatch(setError(error.message));
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy thông tin nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  const themNhiemVu = useCallback(async (nhiemVuData) => {
    try {
      setIsSubmitting(true);
      const nhiemVuMoi = await nhiemVuService.themNhiemVu(nhiemVuData);
      dispatch(setDanhSachNhiemVu([nhiemVuMoi, ...danhSachNhiemVu]));
      toast({
        title: 'Thành công',
        description: 'Đã thêm nhiệm vụ mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return nhiemVuMoi;
    } catch (error) {
      console.error('Lỗi khi thêm nhiệm vụ:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm nhiệm vụ mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, danhSachNhiemVu, toast]);

  const capNhatNhiemVu = useCallback(async (nhiemVuId, nhiemVuData) => {
    try {
      setIsSubmitting(true);
      const nhiemVuCapNhat = await nhiemVuService.capNhatNhiemVu(nhiemVuId, nhiemVuData);
      
      // Cập nhật trong danh sách
      const danhSachMoi = danhSachNhiemVu.map(nhiemVu => 
        nhiemVu.id === nhiemVuId ? nhiemVuCapNhat : nhiemVu
      );
      dispatch(setDanhSachNhiemVu(danhSachMoi));
      
      // Cập nhật nhiệm vụ hiện tại nếu đang xem
      if (nhiemVuHienTai?.id === nhiemVuId) {
        dispatch(setNhiemVuHienTai(nhiemVuCapNhat));
      }

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật nhiệm vụ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return nhiemVuCapNhat;
    } catch (error) {
      console.error('Lỗi khi cập nhật nhiệm vụ:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, danhSachNhiemVu, nhiemVuHienTai, toast]);

  const xoaNhiemVu = useCallback(async (nhiemVuId) => {
    try {
      setIsSubmitting(true);
      await nhiemVuService.xoaNhiemVu(nhiemVuId);
      
      // Xóa khỏi danh sách
      const danhSachMoi = danhSachNhiemVu.filter(nhiemVu => nhiemVu.id !== nhiemVuId);
      dispatch(setDanhSachNhiemVu(danhSachMoi));

      toast({
        title: 'Thành công',
        description: 'Đã xóa nhiệm vụ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Lỗi khi xóa nhiệm vụ:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, danhSachNhiemVu, toast]);

  return {
    // State
    danhSachNhiemVu,
    nhiemVuHienTai,
    loading,
    error,
    isSubmitting,

    // Actions
    layDanhSachNhiemVu,
    layChiTietNhiemVu,
    themNhiemVu,
    capNhatNhiemVu,
    xoaNhiemVu
  };
};