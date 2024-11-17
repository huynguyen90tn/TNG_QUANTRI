// src/components/su_kien_review/services/su_kien_service.js
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

class SuKienService {
  constructor() {
    this.collection = 'su_kien_review';
  }

  async themSuKien(suKien) {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...suKien,
        ngayTao: new Date().toISOString(),
        nguoiTao: auth.currentUser?.uid || '',
        trangThai: 'CHUA_DIEN_RA'
      });
      
      return {
        id: docRef.id,
        ...suKien
      };
    } catch (error) {
      console.error('Lỗi khi thêm sự kiện:', error);
      throw error;
    }
  }

  async capNhatSuKien(id, duLieuCapNhat) {
    try {
      const suKienRef = doc(db, this.collection, id);
      await updateDoc(suKienRef, {
        ...duLieuCapNhat,
        ngayCapNhat: new Date().toISOString()
      });
      
      return {
        id,
        ...duLieuCapNhat
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
      throw error;
    }
  }

  async xoaSuKien(id) {
    try {
      const suKienRef = doc(db, this.collection, id);
      await deleteDoc(suKienRef);
      return id;
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      throw error;
    }
  }

  async laySuKienTheoTrangThai(trangThai) {
    try {
      const q = query(
        collection(db, this.collection),
        where('trangThai', '==', trangThai)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
      throw error;
    }
  }

  async laySuKienSapDienRa() {
    try {
      const ngayHienTai = new Date();
      const q = query(
        collection(db, this.collection),
        where('ngayToChuc', '>=', ngayHienTai.toISOString()),
        where('trangThai', '==', 'CHUA_DIEN_RA')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Lỗi khi lấy sự kiện sắp diễn ra:', error);
      throw error;
    }
  }

  async timKiemSuKien(tuKhoa) {
    try {
      // Firebase không hỗ trợ tìm kiếm text trực tiếp
      // Nên ta sẽ lấy tất cả và filter ở client
      const querySnapshot = await getDocs(collection(db, this.collection));
      
      const ketQua = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(suKien => 
          suKien.tenSuKien.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          suKien.ghiChu?.toLowerCase().includes(tuKhoa.toLowerCase())
        );
        
      return ketQua;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sự kiện:', error);
      throw error;
    }
  }
}

export const suKienService = new SuKienService();