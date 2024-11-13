// File: src/modules/quan_ly_thanh_vien/hooks/use_thanh_vien.js  
// Link tham khảo: https://react-redux.js.org/api/hooks
// Nhánh: main

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../services/firebase';

// Actions
const SET_LOADING = 'thanhVien/setLoading';
const SET_ERROR = 'thanhVien/setError';
const SET_DANH_SACH = 'thanhVien/setDanhSach';
const RESET_ERROR = 'thanhVien/resetError';

// Hàm clean data thành viên
const cleanMemberData = (data) => {
 return {
   id: data.id || '',
   memberCode: data.memberCode || '',
   fullName: data.fullName || '',
   email: data.email || '',
   department: data.department || '',
   position: data.position || '',
   level: data.level || 'THU_SINH',
   status: data.status || 'active',
   joinDate: data.joinDate ? new Date(data.joinDate) : null,
   createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
   updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
 };
};

export const useThanhVien = () => {
 const dispatch = useDispatch();
 const toast = useToast();

 // Select từ Redux store với giá trị mặc định
 const { danhSach, loading, error } = useSelector((state) => ({
   danhSach: state.thanhVien?.danhSach || [],
   loading: state.thanhVien?.loading || false,
   error: state.thanhVien?.error || null
 }));

 // Actions với dispatch
 const setLoading = useCallback((isLoading) => {
   dispatch({ type: SET_LOADING, payload: isLoading });
 }, [dispatch]);

 const setError = useCallback((err) => {
   dispatch({ type: SET_ERROR, payload: err });
 }, [dispatch]);

 const setDanhSach = useCallback((data) => {
   dispatch({ type: SET_DANH_SACH, payload: data });
 }, [dispatch]);

 // Hàm lấy danh sách thành viên từ Firestore
 const layDanhSach = useCallback(async (filters = {}) => {
   try {
     setLoading(true);

     const membersRef = collection(db, 'members');
     const conditions = [];

     if (filters.status) {
       conditions.push(where('status', '==', filters.status));
     }

     if (filters.department) {
       conditions.push(where('department', '==', filters.department));
     }

     if (filters.level) {
       conditions.push(where('level', '==', filters.level));
     }

     const q = conditions.length > 0
       ? query(membersRef, ...conditions, orderBy('fullName', 'asc'))
       : query(membersRef, orderBy('fullName', 'asc'));

     const querySnapshot = await getDocs(q);
     const members = querySnapshot.docs.map(doc =>
       cleanMemberData({ id: doc.id, ...doc.data() })
     );

     setDanhSach(members);
     return members;

   } catch (err) {
     const message = err?.message || 'Không thể lấy danh sách thành viên';
     setError(message);
     toast({
       title: 'Lỗi',
       description: message,
       status: 'error',
       duration: 3000,
       isClosable: true
     });
     return [];

   } finally {
     setLoading(false);
   }
 }, [setLoading, setDanhSach, setError, toast]);

 // Hàm lấy thành viên theo phòng ban
 const layTheoPhongBan = useCallback(async (phongBan) => {
   try {
     setLoading(true);

     const membersRef = collection(db, 'members');
     const q = query(
       membersRef,
       where('department', '==', phongBan),
       where('status', '==', 'active'),
       orderBy('fullName', 'asc')
     );

     const querySnapshot = await getDocs(q);
     const members = querySnapshot.docs.map(doc =>
       cleanMemberData({ id: doc.id, ...doc.data() })
     );

     setDanhSach(members);
     return members;

   } catch (err) {
     const message = err?.message || 'Không thể lấy danh sách thành viên';
     setError(message);
     toast({
       title: 'Lỗi',
       description: message,
       status: 'error',
       duration: 3000,
       isClosable: true
     });
     return [];

   } finally {
     setLoading(false);
   }
 }, [setLoading, setDanhSach, setError, toast]);

 // Effect xử lý lỗi
 useEffect(() => {
   if (error) {
     toast({
       title: 'Lỗi',
       description: error,
       status: 'error',
       duration: 3000,
       isClosable: true,
       position: 'top'
     });
     dispatch({ type: RESET_ERROR });
   }
 }, [error, toast, dispatch]);

 // Effect tự động load danh sách
 useEffect(() => {
   layDanhSach({ status: 'active' });
 }, [layDanhSach]);

 return {
   danhSach,
   loading,
   error,
   layDanhSach,
   layTheoPhongBan
 };
};

export default useThanhVien;