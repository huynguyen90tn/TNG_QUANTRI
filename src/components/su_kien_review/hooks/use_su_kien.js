import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useToast } from '@chakra-ui/react';
import { db } from '../../../services/firebase.js';

const auth = getAuth();

export const useSuKien = () => {
  const [suKiens, setSuKiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [trangThai, setTrangThai] = useState('TAT_CA');
  const toast = useToast();

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
      ngayToChuc: data.ngayToChuc || '',
      ngayKetThuc: data.ngayKetThuc || '',
      gioToChuc: data.gioToChuc || '',
      gioKetThuc: data.gioKetThuc || '',
      thanhVienThamGia: data.thanhVienThamGia || [],
      nguoiLienHe: data.nguoiLienHe || [],
      links: data.links || [],
      media: data.media || [],
      tenSuKien: data.tenSuKien || '',
      donViToChuc: data.donViToChuc || '',
      diaDiem: data.diaDiem || '',
      trangThai: data.trangThai || 'CHUA_DIEN_RA',
      ghiChu: data.ghiChu || ''
    };
  }, []);

  // Firestore subscription với error handling tốt hơn
  useEffect(() => {
    let unsubscribe;
    const initializeFirestore = async () => {
      try {
        console.log('Khởi tạo kết nối Firestore...');
        
        unsubscribe = onSnapshot(
          suKienQuery, 
          (snapshot) => {
            console.log(`Nhận ${snapshot.docs.length} documents`);
            const suKienList = snapshot.docs.map(transformSuKienData);
            setSuKiens(suKienList);
            setLoading(false);
            setError(null);
          },
          (error) => {
            console.error("Lỗi Firestore listener:", error);
            setError(error);
            setLoading(false);
            toast({
              title: "Lỗi kết nối",
              description: "Không thể tải dữ liệu sự kiện",
              status: "error",
              duration: 5000,
              isClosable: true
            });
          }
        );
      } catch (err) {
        console.error("Lỗi khởi tạo hook:", err);
        setError(err);
        setLoading(false);
        toast({
          title: "Lỗi khởi tạo",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true
        });
      }
    };

    initializeFirestore();

    return () => {
      console.log('Dọn dẹp Firestore listener...');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [suKienQuery, transformSuKienData, toast]);

  // Thêm sự kiện mới
  const themSuKien = useCallback(async (suKienData) => {
    if (!auth.currentUser) {
      throw new Error('Người dùng chưa đăng nhập');
    }

    try {
      const docRef = await addDoc(collection(db, 'su_kien_review'), {
        ...suKienData,
        ngayTao: serverTimestamp(),
        ngayCapNhat: serverTimestamp(),
        nguoiTao: {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || '',
          photoURL: auth.currentUser.photoURL || ''
        },
        trangThai: suKienData.trangThai || 'CHUA_DIEN_RA'
      });
      
      return { id: docRef.id, ...suKienData };
    } catch (error) {
      console.error('Lỗi khi thêm sự kiện:', error);
      throw error;
    }
  }, []);

  // Handlers được memoized
  const searchSuKien = useCallback((term) => {
    console.log('Tìm kiếm:', term);
    setSearchTerm(term);
  }, []);

  const filterTrangThai = useCallback((status) => {
    console.log('Lọc theo trạng thái:', status);
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
    if (!auth.currentUser) {
      throw new Error('Người dùng chưa đăng nhập');
    }

    try {
      const docRef = doc(db, 'su_kien_review', id);
      await updateDoc(docRef, {
        ...data,
        ngayCapNhat: serverTimestamp(),
        nguoiCapNhat: {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || '',
          photoURL: auth.currentUser.photoURL || ''
        }
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

  // Filtered data được memoized
  const filteredSuKiens = useMemo(() => {
    return suKiens.filter(suKien => {
      const matchSearch = suKien.tenSuKien.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTrangThai = trangThai === 'TAT_CA' || suKien.trangThai === trangThai;
      return matchSearch && matchTrangThai;
    });
  }, [suKiens, searchTerm, trangThai]);

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
    xoaSuKien,
    themSuKien // Đảm bảo export function này
  };
};

export default useSuKien;