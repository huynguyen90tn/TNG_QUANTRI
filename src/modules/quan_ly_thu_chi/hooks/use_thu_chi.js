// File: src/modules/quan_ly_thu_chi/hooks/use_thu_chi.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main 

import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@chakra-ui/react';

export const useThuChi = () => {
  const [danhSachThuChi, setDanhSachThuChi] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const layDanhSachThuChi = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const thuChiRef = collection(db, 'thu_chi');
      
      const q = query(
        thuChiRef,
        where('nguoiTao', '==', user.id),
        orderBy('ngayTao', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ngayTao: doc.data().ngayTao?.toDate() || new Date()
      }));

      setDanhSachThuChi(data);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách thu chi',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      console.error('Lỗi khi lấy danh sách thu chi:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const themThuChi = useCallback(async (data) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const thuChiRef = collection(db, 'thu_chi');
      
      const thuChiData = {
        ...data,
        nguoiTao: user.id,
        ngayTao: Timestamp.now(),
        ngayCapNhat: Timestamp.now()
      };
      
      await addDoc(thuChiRef, thuChiData);
      await layDanhSachThuChi();
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm khoản thu chi',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      console.error('Lỗi khi thêm thu chi:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast, layDanhSachThuChi]);

  const capNhatThuChi = useCallback(async (id, data) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const thuChiRef = doc(db, 'thu_chi', id);
      
      const thuChiData = {
        ...data,
        ngayCapNhat: Timestamp.now()
      };
      
      await updateDoc(thuChiRef, thuChiData);
      await layDanhSachThuChi();
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật khoản thu chi',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      console.error('Lỗi khi cập nhật thu chi:', error);
    } finally {
      setIsLoading(false);
    }
  }, [toast, layDanhSachThuChi]);

  const xoaThuChi = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const thuChiRef = doc(db, 'thu_chi', id);
      await deleteDoc(thuChiRef);
      await layDanhSachThuChi();
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa khoản thu chi',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      console.error('Lỗi khi xóa thu chi:', error);
    } finally {
      setIsLoading(false);
    }
  }, [toast, layDanhSachThuChi]);

  useEffect(() => {
    if (user?.id) {
      layDanhSachThuChi();
    }
  }, [user?.id, layDanhSachThuChi]);

  return {
    danhSachThuChi,
    isLoading,
    themThuChi,
    capNhatThuChi,
    xoaThuChi,
    layDanhSachThuChi // Export function này
  };
};

export default useThuChi;