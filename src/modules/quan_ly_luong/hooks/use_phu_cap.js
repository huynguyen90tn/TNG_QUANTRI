 
// File: src/modules/quan_ly_luong/hooks/use_phu_cap.js
// Link tham khảo: https://react.dev/learn/reusing-logic-with-custom-hooks
// Nhánh: main

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { LOAI_PHU_CAP } from '../constants/loai_luong';
import { useAuth } from '../../../hooks/useAuth';

export const usePhuCap = (userId = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [danhSachPhuCap, setDanhSachPhuCap] = useState([]);
  const toast = useToast();
  const { user } = useAuth();

  const fetchDanhSachPhuCap = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const phuCapRef = collection(db, 'phu_cap');
      let phuCapQuery = query(phuCapRef);

      if (userId) {
        phuCapQuery = query(phuCapRef, where('userId', '==', userId));
      }

      const querySnapshot = await getDocs(phuCapQuery);
      const phuCapList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setDanhSachPhuCap(phuCapList);
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách phụ cấp',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchDanhSachPhuCap();
  }, [fetchDanhSachPhuCap]);

  const themPhuCap = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);

      const phuCapData = {
        ...data,
        nguoiTao: user.id,
        ngayTao: new Date(),
        ngayCapNhat: new Date()
      };

      const docRef = await addDoc(collection(db, 'phu_cap'), phuCapData);
      
      setDanhSachPhuCap(prev => [...prev, { id: docRef.id, ...phuCapData }]);
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm phụ cấp mới',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      return { id: docRef.id, ...phuCapData };
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm phụ cấp',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const capNhatPhuCap = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);

      const phuCapRef = doc(db, 'phu_cap', id);
      const updateData = {
        ...data,
        ngayCapNhat: new Date()
      };

      await updateDoc(phuCapRef, updateData);

      setDanhSachPhuCap(prev =>
        prev.map(item =>
          item.id === id ? { ...item, ...updateData } : item
        )
      );

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật phụ cấp',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật phụ cấp',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const xoaPhuCap = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(db, 'phu_cap', id));
      
      setDanhSachPhuCap(prev => prev.filter(item => item.id !== id));

      toast({
        title: 'Thành công',
        description: 'Đã xóa phụ cấp',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa phụ cấp',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const tinhTongPhuCap = useCallback((userId = null) => {
    const phuCapList = userId
      ? danhSachPhuCap.filter(item => item.userId === userId)
      : danhSachPhuCap;

    return phuCapList.reduce((total, item) => total + Number(item.mucPhuCap), 0);
  }, [danhSachPhuCap]);

  const layPhuCapTheoLoai = useCallback((loaiPhuCap) => {
    return danhSachPhuCap.filter(item => item.loaiPhuCap === loaiPhuCap);
  }, [danhSachPhuCap]);

  return {
    loading,
    error,
    danhSachPhuCap,
    themPhuCap,
    capNhatPhuCap,
    xoaPhuCap,
    tinhTongPhuCap,
    layPhuCapTheoLoai,
    fetchDanhSachPhuCap
  };
};

export default usePhuCap;