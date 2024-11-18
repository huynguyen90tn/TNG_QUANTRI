// File: src/components/su_kien_review/hooks/use_su_kien.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../../services/firebase.js'; // Sửa lại đúng đường dẫn

export const useSuKien = () => {
  const [suKiens, setSuKiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [trangThai, setTrangThai] = useState('TAT_CA');

  // Memoize query setup
  const suKienQuery = useMemo(() => {
    const suKienRef = collection(db, 'su_kien_review');
    return query(suKienRef, orderBy('ngayTao', 'desc'));
  }, []);

  // Data transformation function
  const transformSuKienData = useCallback((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      ngayTao: data.ngayTao?.toDate?.() || data.ngayTao,
      ngayCapNhat: data.ngayCapNhat?.toDate?.() || data.ngayCapNhat,
      ngayToChuc: data.ngayToChuc,
      ngayKetThuc: data.ngayKetThuc,
      gioToChuc: data.gioToChuc,
      gioKetThuc: data.gioKetThuc,
      thanhVienThamGia: data.thanhVienThamGia || [],
      nguoiLienHe: data.nguoiLienHe || [],
      links: data.links || [],
      media: data.media || [],
      tenSuKien: data.tenSuKien || '',
      donViToChuc: data.donViToChuc || '',
      diaDiem: data.diaDiem || '',
      trangThai: data.trangThai || 'CHUA_DIEN_RA'
    };
  }, []);

  // Firestore subscription
  useEffect(() => {
    let unsubscribe;
    try {
      console.log('Initializing Firestore connection...');
      
      unsubscribe = onSnapshot(suKienQuery, 
        (snapshot) => {
          console.log(`Received ${snapshot.docs.length} documents`);
          const suKienList = snapshot.docs.map(transformSuKienData);
          setSuKiens(suKienList);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error("Firestore listener error:", error);
          setError(error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Hook initialization error:", err);
      setError(err);
      setLoading(false);
    }

    return () => {
      console.log('Cleaning up Firestore listener...');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [suKienQuery, transformSuKienData]);

  // Memoized handlers
  const searchSuKien = useCallback((term) => {
    console.log('Searching for:', term);
    setSearchTerm(term);
  }, []);

  const filterTrangThai = useCallback((status) => {
    console.log('Filtering by status:', status);
    setTrangThai(status);
  }, []);

  const layChiTietSuKien = useCallback(async (id) => {
    try {
      const docRef = doc(db, 'su_kien_review', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return transformSuKienData(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sự kiện:', error);
      throw error;
    }
  }, [transformSuKienData]);

  const capNhatSuKien = useCallback(async (id, data) => {
    try {
      const docRef = doc(db, 'su_kien_review', id);
      await updateDoc(docRef, {
        ...data,
        ngayCapNhat: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
      throw error;
    }
  }, []);

  const xoaSuKien = useCallback(async (id) => {
    try {
      const docRef = doc(db, 'su_kien_review', id);
      await deleteDoc(docRef);
      setSuKiens(prev => prev.filter(suKien => suKien.id !== id));
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      throw error;
    }
  }, []);

  // Filtered data
  const filteredSuKiens = useMemo(() => {
    return suKiens.filter(suKien => {
      const matchSearch = suKien.tenSuKien.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTrangThai = trangThai === 'TAT_CA' || suKien.trangThai === trangThai;
      return matchSearch && matchTrangThai;
    });
  }, [suKiens, searchTerm, trangThai]);

  // Debug state changes
  useEffect(() => {
    console.log('Current state:', {
      suKiensCount: filteredSuKiens.length,
      loading,
      error,
      searchTerm,
      trangThai
    });
  }, [filteredSuKiens, loading, error, searchTerm, trangThai]);

  return {
    suKiens: filteredSuKiens,
    loading,
    error,
    searchTerm,
    trangThai,
    searchSuKien,
    filterTrangThai,
    layChiTietSuKien,
    capNhatSuKien,
    xoaSuKien
  };
};

export default useSuKien;