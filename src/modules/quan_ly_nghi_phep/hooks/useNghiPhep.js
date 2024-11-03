// File: src/modules/quan_ly_nghi_phep/hooks/useNghiPhep.js
// Link tham khảo: https://firebase.google.com/docs/firestore/query-data/queries
// Link tham khảo: https://react.dev/reference/react/hooks

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { nghiPhepService } from '../services/nghi_phep_service';

export const useNghiPhep = () => {
 const { user } = useAuth();
 const toast = useToast();
 const [isLoading, setIsLoading] = useState(false);
 const [donNghiPheps, setDonNghiPheps] = useState([]);
 const [selectedDon, setSelectedDon] = useState(null);
 const [error, setError] = useState(null);

 // Lấy danh sách đơn nghỉ phép
 const loadDanhSachDon = useCallback(async (filters = {}) => {
   try {
     setIsLoading(true);
     setError(null);

     // Kiểm tra role để set filters
     const queryFilters = { ...filters };
     if (user && user.role !== 'admin-tong') {
       queryFilters.userId = user.id;
     }
     if (user && user.role === 'admin-con') {
       queryFilters.department = user.department;
     }

     const data = await nghiPhepService.layDanhSach(queryFilters);
     setDonNghiPheps(data);
   } catch (err) {
     console.error('Lỗi khi tải danh sách đơn:', err);
     setError(err.message);
     toast({
       title: 'Lỗi',
       description: 'Không thể tải danh sách đơn nghỉ phép',
       status: 'error',
       duration: 3000,
       isClosable: true,
     });
   } finally {
     setIsLoading(false);
   }
 }, [user, toast]);

 // Tải chi tiết một đơn
 const loadChiTietDon = useCallback(async (id) => {
   try {
     setIsLoading(true);
     setError(null);
     const data = await nghiPhepService.layChiTiet(id);
     setSelectedDon(data);
   } catch (err) {
     console.error('Lỗi khi tải chi tiết đơn:', err);
     setError(err.message);
     toast({
       title: 'Lỗi',
       description: 'Không thể tải thông tin chi tiết đơn',
       status: 'error',
       duration: 3000,
       isClosable: true,
     });
   } finally {
     setIsLoading(false);
   }
 }, [toast]);

 // Tạo đơn mới
 const themDonNghiPhep = useCallback(async (data) => {
   try {
     setIsLoading(true);
     setError(null);

     // Thêm thông tin user vào data
     const donData = {
       ...data,
       userId: user.id,
       userName: user.displayName,
       userEmail: user.email,
       department: user.department,
     };

     const result = await nghiPhepService.themDon(donData);
     
     // Cập nhật lại danh sách
     setDonNghiPheps(prev => [result, ...prev]);

     toast({
       title: 'Thành công',
       description: 'Đã tạo đơn xin nghỉ phép',
       status: 'success',
       duration: 3000,
       isClosable: true,
     });

     return result;
   } catch (err) {
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
 }, [user, toast]);

 // Cập nhật trạng thái đơn
 const capNhatTrangThaiDon = useCallback(async (id, updateData) => {
   try {
     setIsLoading(true);
     setError(null);

     // Thêm thông tin người duyệt
     const fullUpdateData = {
       ...updateData,
       approverId: user.id,
       approverName: user.displayName,
       approverEmail: user.email,
       approverRole: user.role,
       approverDepartment: user.department
     };

     const result = await nghiPhepService.capNhatTrangThai(id, fullUpdateData);
     
     // Cập nhật lại danh sách
     setDonNghiPheps(prev =>
       prev.map(don => don.id === id ? result : don)
     );

     // Cập nhật selected nếu đang xem
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

     return result;
   } catch (err) {
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
 }, [user, selectedDon, toast]);

 // Hủy đơn
 const huyDonNghiPhep = useCallback(async (id) => {
   try {
     setIsLoading(true);
     setError(null);

     const result = await nghiPhepService.huyDon(id);
     
     // Cập nhật lại danh sách
     setDonNghiPheps(prev =>
       prev.map(don => don.id === id ? result : don)
     );

     // Cập nhật selected nếu đang xem
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

     return result;
   } catch (err) {
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
 }, [selectedDon, toast]);

 // Tải danh sách khi component mount
 useEffect(() => {
   if (user) {
     loadDanhSachDon();
   }
 }, [user, loadDanhSachDon]);

 return {
   isLoading,
   error,
   donNghiPheps,
   selectedDon,
   loadDanhSachDon,
   loadChiTietDon,
   themDonNghiPhep,
   capNhatTrangThaiDon,
   huyDonNghiPhep,
   setSelectedDon
 };
};

export default useNghiPhep;