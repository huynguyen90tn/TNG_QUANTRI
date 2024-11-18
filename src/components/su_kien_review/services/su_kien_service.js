// File: src/components/su_kien_review/services/su_kien_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { 
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../services/firebase';

const auth = getAuth();
const COLLECTION_NAME = 'su_kien_review';

// Helper functions để chuẩn hóa dữ liệu
const normalizeArrayData = (array, formatter) => {
  return Array.isArray(array) ? array.map(formatter) : [];
};

const formatNguoiLienHe = (nguoi) => ({
  hoTen: nguoi.hoTen?.trim() || '',
  chucVu: nguoi.chucVu?.trim() || '',
  soDienThoai: nguoi.soDienThoai?.trim() || '',
  ghiChu: nguoi.ghiChu?.trim() || ''
});

const formatLink = (link) => ({
  url: link.url?.trim() || '',
  ghiChu: link.ghiChu?.trim() || ''
});

const formatMedia = (item) => ({
  type: item.type || 'image',
  url: item.url?.trim() || '',
  caption: item.caption?.trim() || ''
});

const formatSuKien = (doc) => ({
  id: doc.id,
  ...doc.data()
});

class SuKienService {
  constructor() {
    this.collectionRef = collection(db, COLLECTION_NAME);
  }

  async themSuKien(suKien) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      // Chuẩn bị dữ liệu
      const suKienData = {
        // Thông tin cơ bản bắt buộc
        tenSuKien: suKien.tenSuKien?.trim() || '',
        donViToChuc: suKien.donViToChuc?.trim() || '',
        ngayToChuc: suKien.ngayToChuc || '',
        gioToChuc: suKien.gioToChuc || '',
        ngayKetThuc: suKien.ngayKetThuc || '',
        gioKetThuc: suKien.gioKetThuc || '',
        diaDiem: suKien.diaDiem?.trim() || '',
        
        // Metadata
        trangThai: 'CHUA_DIEN_RA',
        ngayTao: serverTimestamp(),
        ngayCapNhat: serverTimestamp(),
        
        // Thông tin người tạo
        nguoiTao: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || ''
        },

        // Dữ liệu mảng được chuẩn hóa
        thanhVienThamGia: normalizeArrayData(suKien.thanhVienThamGia, item => item?.trim() || ''),
        nguoiLienHe: normalizeArrayData(suKien.nguoiLienHe, formatNguoiLienHe),
        links: normalizeArrayData(suKien.links, formatLink),
        media: normalizeArrayData(suKien.media, formatMedia),
        
        // Thông tin bổ sung
        ghiChu: suKien.ghiChu?.trim() || ''
      };

      // Validate dữ liệu
      const requiredFields = [
        'tenSuKien', 'donViToChuc', 'ngayToChuc', 
        'gioToChuc', 'ngayKetThuc', 'gioKetThuc', 'diaDiem'
      ];

      const missingFields = requiredFields.filter(field => !suKienData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
      }

      const docRef = await addDoc(this.collectionRef, suKienData);
      return {
        id: docRef.id,
        ...suKienData
      };
    } catch (error) {
      console.error('Lỗi khi thêm sự kiện:', error);
      throw error;
    }
  }

  async capNhatSuKien(id, duLieuCapNhat) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy sự kiện');
      }

      const duLieuHienTai = docSnap.data();
      if (duLieuHienTai.nguoiTao?.uid !== currentUser.uid) {
        throw new Error('Không có quyền cập nhật sự kiện này');
      }

      const duLieuMoi = {
        ...duLieuCapNhat,
        ngayCapNhat: serverTimestamp(),
        nguoiCapNhat: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || ''
        },
        
        // Chuẩn hóa dữ liệu mảng
        thanhVienThamGia: normalizeArrayData(duLieuCapNhat.thanhVienThamGia, item => item?.trim() || ''),
        nguoiLienHe: normalizeArrayData(duLieuCapNhat.nguoiLienHe, formatNguoiLienHe),
        links: normalizeArrayData(duLieuCapNhat.links, formatLink),
        media: normalizeArrayData(duLieuCapNhat.media, formatMedia)
      };

      await updateDoc(docRef, duLieuMoi);
      return {
        id,
        ...duLieuMoi
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
      throw error;
    }
  }

  async xoaSuKien(id) {
    try {
      if (!id) {
        throw new Error('ID sự kiện không hợp lệ');
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy sự kiện');
      }

      const suKienData = docSnap.data();
      if (suKienData.nguoiTao?.uid !== currentUser.uid) {
        throw new Error('Không có quyền xóa sự kiện này');
      }

      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      throw error;
    }
  }

  async layDanhSachSuKien() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const q = query(
        this.collectionRef,
        where('nguoiTao.uid', '==', currentUser.uid),
        orderBy('ngayTao', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(formatSuKien);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
      throw error;
    }
  }

  async laySuKienTheoTrangThai(trangThai) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const q = trangThai === 'TAT_CA'
        ? query(
            this.collectionRef,
            where('nguoiTao.uid', '==', currentUser.uid),
            orderBy('ngayTao', 'desc')
          )
        : query(
            this.collectionRef,
            where('nguoiTao.uid', '==', currentUser.uid),
            where('trangThai', '==', trangThai),
            orderBy('ngayTao', 'desc')
          );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(formatSuKien);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
      throw error;
    }
  }

  async laySuKienSapDienRa() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const ngayHienTai = new Date().toISOString();
      const q = query(
        this.collectionRef,
        where('nguoiTao.uid', '==', currentUser.uid),
        where('ngayToChuc', '>=', ngayHienTai),
        where('trangThai', '==', 'CHUA_DIEN_RA'),
        orderBy('ngayToChuc', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(formatSuKien);
    } catch (error) {
      console.error('Lỗi khi lấy sự kiện sắp diễn ra:', error);
      throw error;
    }
  }

  async timKiemSuKien(tuKhoa) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const q = query(
        this.collectionRef,
        where('nguoiTao.uid', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      if (!tuKhoa?.trim()) {
        return querySnapshot.docs.map(formatSuKien);
      }

      const searchTerm = tuKhoa.toLowerCase().trim();
      return querySnapshot.docs
        .map(formatSuKien)
        .filter(suKien => (
          suKien.tenSuKien?.toLowerCase().includes(searchTerm) ||
          suKien.donViToChuc?.toLowerCase().includes(searchTerm) ||
          suKien.diaDiem?.toLowerCase().includes(searchTerm) ||
          suKien.ghiChu?.toLowerCase().includes(searchTerm) ||
          suKien.nguoiLienHe?.some(nguoi => 
            nguoi.hoTen?.toLowerCase().includes(searchTerm) ||
            nguoi.chucVu?.toLowerCase().includes(searchTerm)
          ) ||
          suKien.thanhVienThamGia?.some(thanhVien =>
            thanhVien.toLowerCase().includes(searchTerm)
          )
        ))
        .sort((a, b) => b.ngayTao?.seconds - a.ngayTao?.seconds);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sự kiện:', error);
      throw error;
    }
  }

  async laySuKienTheoId(id) {
    try {
      if (!id) {
        throw new Error('ID sự kiện không hợp lệ');
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Người dùng chưa đăng nhập');
      }

      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy sự kiện');
      }

      const suKienData = docSnap.data();
      if (suKienData.nguoiTao?.uid !== currentUser.uid) {
        throw new Error('Không có quyền xem sự kiện này');
      }

      return formatSuKien(docSnap);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sự kiện:', error);
      throw error;
    }
  }
}

export const suKienService = new SuKienService();

export default suKienService;