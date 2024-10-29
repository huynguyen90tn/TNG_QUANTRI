import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import duAnService from '../services/du_an_service';
import {
  setDanhSachDuAn,
  setDuAnHienTai,
  setLoading,
  setError
} from '../store/du_an_slice';

export const useDuAn = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    danhSachDuAn,
    duAnHienTai,
    loading,
    error
  } = useSelector((state) => state.duAn);

  const layDanhSachDuAn = useCallback(async (phongBan) => {
    try {
      dispatch(setLoading(true));
      const danhSach = await duAnService.getDanhSachDuAn(phongBan);
      dispatch(setDanhSachDuAn(danhSach));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dự án:', error);
      dispatch(setError(error.message));
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách dự án',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  const layChiTietDuAn = useCallback(async (duAnId) => {
    try {
      dispatch(setLoading(true));
      const duAn = await duAnService.getDuAn(duAnId);
      dispatch(setDuAnHienTai(duAn));
      return duAn;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết dự án:', error);
      dispatch(setError(error.message));
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy thông tin dự án',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  const themDuAn = useCallback(async (duAnData) => {
    try {
      setIsSubmitting(true);
      const duAnMoi = await duAnService.themDuAn(duAnData);
      dispatch(setDanhSachDuAn([duAnMoi, ...danhSachDuAn]));
      toast({
        title: 'Thành công',
        description: 'Đã thêm dự án mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return duAnMoi;
    } catch (error) {
      console.error('Lỗi khi thêm dự án:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm dự án mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, danhSachDuAn, toast]);

  const capNhatDuAn = useCallback(async (duAnId, duAnData) => {
    try {
      setIsSubmitting(true);
      const duAnCapNhat = await duAnService.capNhatDuAn(duAnId, duAnData);
      
      // Cập nhật trong danh sách
      const danhSachMoi = danhSachDuAn.map(duAn => 
        duAn.id === duAnId ? duAnCapNhat : duAn
      );
      dispatch(setDanhSachDuAn(danhSachMoi));
      
      // Cập nhật dự án hiện tại nếu đang xem
      if (duAnHienTai?.id === duAnId) {
        dispatch(setDuAnHienTai(duAnCapNhat));
      }

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật dự án',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return duAnCapNhat;
    } catch (error) {
      console.error('Lỗi khi cập nhật dự án:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật dự án',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, danhSachDuAn, duAnHienTai, toast]);

  const xoaDuAn = useCallback(async (duAnId) => {
    try {
      setIsSubmitting(true);
      await duAnService.xoaDuAn(duAnId);
      
      // Xóa khỏi danh sách
      const danhSachMoi = danhSachDuAn.filter(duAn => duAn.id !== duAnId);
      dispatch(setDanhSachDuAn(danhSachMoi));

      toast({
        title: 'Thành công',
        description: 'Đã xóa dự án',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Lỗi khi xóa dự án:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa dự án',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, danhSachDuAn, toast]);

  const layThongKeDuAn = useCallback(async (duAnId) => {
    try {
      dispatch(setLoading(true));
      return await duAnService.getThongKeDuAn(duAnId);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê dự án:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy thống kê dự án',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  return {
    // State
    danhSachDuAn,
    duAnHienTai,
    loading,
    error,
    isSubmitting,

    // Actions
    layDanhSachDuAn,
    layChiTietDuAn,
    themDuAn,
    capNhatDuAn,
    xoaDuAn,
    layThongKeDuAn
  };
};