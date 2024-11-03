// File: src/modules/quan_ly_nghi_phep/hooks/useNghiPhep.js
// Link tham khảo: https://firebase.google.com/docs/firestore/query-data/queries
// Link tham khảo: https://react.dev/reference/react/hooks

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import nghiPhepService from '../services/nghi_phep_service';

export const useNghiPhep = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [donNghiPheps, setDonNghiPheps] = useState([]);
  const [selectedDon, setSelectedDon] = useState(null);
  const [error, setError] = useState(null);

  const validateUser = useCallback(() => {
    if (!isAuthenticated || authLoading) {
      return false;
    }
    if (!user?.id) {
      return false;
    }
    return true;
  }, [user, isAuthenticated, authLoading]);

  const loadDanhSachDon = useCallback(async (filters = {}) => {
    if (!validateUser()) {
      setDonNghiPheps([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const queryFilters = { ...filters };
      if (user?.role === 'member') {
        queryFilters.userId = user.id;
      } else if (user?.role === 'admin-con') {
        queryFilters.department = user.department;
      }

      const data = await nghiPhepService.layDanhSach(queryFilters);
      setDonNghiPheps(Array.isArray(data) ? data : []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi khi tải danh sách đơn:', err);
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tải danh sách đơn nghỉ phép',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, validateUser]);

  const themDonNghiPhep = useCallback(async (data) => {
    if (!validateUser()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập để thực hiện chức năng này',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const donData = {
        ...data,
        userId: user.id,
        userName: user.displayName || '',
        userEmail: user.email || '',
        department: user.department || '',
        maSoNhanVien: user.memberCode || '',
        role: user.role || 'member'
      };

      const result = await nghiPhepService.themDon(donData);
      
      if (result) {
        setDonNghiPheps(prev => [result, ...prev]);
        toast({
          title: 'Thành công',
          description: 'Đã tạo đơn xin nghỉ phép',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi khi tạo đơn:', err);
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tạo đơn xin nghỉ phép',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, validateUser]);

  const capNhatTrangThaiDon = useCallback(async (id, updateData) => {
    if (!validateUser()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập để thực hiện chức năng này',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const fullUpdateData = {
        ...updateData,
        approverId: user.id,
        approverName: user.displayName || '',
        approverEmail: user.email || '',
        approverRole: user.role || '',
        approverDepartment: user.department || ''
      };

      const result = await nghiPhepService.capNhatTrangThai(id, fullUpdateData);
      
      if (result) {
        setDonNghiPheps(prev =>
          prev.map(don => don.id === id ? result : don)
        );

        if (selectedDon?.id === id) {
          setSelectedDon(result);
        }

        toast({
          title: 'Thành công',
          description: 'Đã cập nhật trạng thái đơn',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi khi cập nhật trạng thái:', err);
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể cập nhật trạng thái đơn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedDon, toast, validateUser]);

  const huyDonNghiPhep = useCallback(async (id) => {
    if (!validateUser()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập để thực hiện chức năng này',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await nghiPhepService.huyDon(id);
      
      if (result) {
        setDonNghiPheps(prev =>
          prev.map(don => don.id === id ? result : don)
        );

        if (selectedDon?.id === id) {
          setSelectedDon(result);
        }

        toast({
          title: 'Thành công',
          description: 'Đã hủy đơn xin nghỉ phép',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi khi hủy đơn:', err);
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể hủy đơn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedDon, toast, validateUser]);

  useEffect(() => {
    if (validateUser()) {
      loadDanhSachDon();
    }
  }, [loadDanhSachDon, validateUser]);

  return {
    isLoading: isLoading || authLoading,
    error,
    donNghiPheps,
    selectedDon,
    loadDanhSachDon,
    themDonNghiPhep,
    capNhatTrangThaiDon, 
    huyDonNghiPhep,
    setSelectedDon,
    isAuthenticated
  };
};

export default useNghiPhep;