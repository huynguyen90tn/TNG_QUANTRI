// src/services/api/baoCaoApi.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  getDoc,
  Timestamp,
  orderBy,
  limit,
  where
} from "firebase/firestore";

const BAO_CAO_COLLECTION = 'bao_cao';

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing currentUser:', error);
    return null;
  }
};

export const baoCaoApi = {
  taoMoi: async (data) => {
    try {
      const currentUser = getCurrentUser();
      
      const baoCaoData = {
        ...data,
        ngayTao: Timestamp.now(),
        ngayCapNhat: Timestamp.now(),
        trangThai: 'cho_duyet',
        nguoiTaoInfo: {
          ...data.nguoiTaoInfo,
          email: currentUser?.email || data.nguoiTaoInfo?.email || '',
        }
      };

      const docRef = await addDoc(collection(db, BAO_CAO_COLLECTION), baoCaoData);
      
      return {
        id: docRef.id,
        ...baoCaoData,
        ngayTao: baoCaoData.ngayTao.toDate().toISOString(),
        ngayCapNhat: baoCaoData.ngayCapNhat.toDate().toISOString()
      };
    } catch (error) {
      throw new Error('Lỗi khi tạo báo cáo: ' + error.message);
    }
  },

  layDanhSach: async (filters = {}, sapXep = {}, phanTrang = {}) => {
    try {
      const conditions = [orderBy('ngayTao', 'desc')];
      
      if (filters.email) {
        conditions.push(where('nguoiTaoInfo.email', '==', filters.email));
      }

      const q = query(
        collection(db, BAO_CAO_COLLECTION),
        ...conditions,
        limit(100)
      );

      const snapshot = await getDocs(q);
      let baoCao = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ngayTao: doc.data().ngayTao?.toDate()?.toISOString(),
        ngayCapNhat: doc.data().ngayCapNhat?.toDate()?.toISOString()
      }));

      if (filters.loaiBaoCao) {
        baoCao = baoCao.filter(item => item.loaiBaoCao === filters.loaiBaoCao);
      }
      
      if (filters.phanHe) {
        baoCao = baoCao.filter(item => item.phanHe === filters.phanHe);
      }

      if (filters.trangThai) {
        baoCao = baoCao.filter(item => item.trangThai === filters.trangThai);
      }

      if (filters.tuNgay) {
        const tuNgay = new Date(filters.tuNgay);
        baoCao = baoCao.filter(item => new Date(item.ngayTao) >= tuNgay);
      }

      if (filters.denNgay) {
        const denNgay = new Date(filters.denNgay);
        baoCao = baoCao.filter(item => new Date(item.ngayTao) <= denNgay);
      }

      if (filters.ngay) {
        const ngayFilter = new Date(filters.ngay);
        baoCao = baoCao.filter(item => {
          const ngayBaoCao = new Date(item.ngayTao);
          return ngayBaoCao.toDateString() === ngayFilter.toDateString();
        });
      }

      const startIndex = (phanTrang.trang - 1) * phanTrang.soLuong || 0;
      const endIndex = startIndex + (phanTrang.soLuong || 10);

      return {
        data: baoCao.slice(startIndex, endIndex),
        total: baoCao.length,
        hasMore: endIndex < baoCao.length
      };

    } catch (error) {
      throw new Error('Lỗi khi tải danh sách báo cáo: ' + error.message);
    }
  },kiemTraBaoCaoNgay: async (email, ngay) => {
    try {
      const startOfDay = new Date(ngay);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(ngay);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, BAO_CAO_COLLECTION),
        where('nguoiTaoInfo.email', '==', email),
        where('ngayTao', '>=', Timestamp.fromDate(startOfDay)),
        where('ngayTao', '<=', Timestamp.fromDate(endOfDay))
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Lỗi kiểm tra báo cáo ngày:', error);
      return false;
    }
  },

  layChiTiet: async (id) => {
    try {
      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy báo cáo');
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        ngayTao: data.ngayTao?.toDate()?.toISOString(),
        ngayCapNhat: data.ngayCapNhat?.toDate()?.toISOString()
      };
    } catch (error) {
      throw new Error('Lỗi khi lấy chi tiết báo cáo: ' + error.message);
    }
  },

  capNhat: async (id, data) => {
    try {
      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        ...data,
        ngayCapNhat: Timestamp.now()
      };

      await updateDoc(docRef, updateData);

      return {
        id,
        ...updateData,
        ngayCapNhat: updateData.ngayCapNhat.toDate().toISOString()
      };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật báo cáo: ' + error.message);
    }
  },

  duyetBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        trangThai: 'da_duyet',
        ngayCapNhat: Timestamp.now(),
        ghiChu,
        nguoiDuyet
      };

      await updateDoc(docRef, updateData);

      return {
        id,
        ...updateData,
        ngayCapNhat: updateData.ngayCapNhat.toDate().toISOString()
      };
    } catch (error) {
      throw new Error('Lỗi khi duyệt báo cáo: ' + error.message);
    }
  },

  tuChoiBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        trangThai: 'tu_choi',
        ngayCapNhat: Timestamp.now(),
        ghiChu,
        nguoiDuyet
      };

      await updateDoc(docRef, updateData);

      return {
        id,
        ...updateData,
        ngayCapNhat: updateData.ngayCapNhat.toDate().toISOString()
      };
    } catch (error) {
      throw new Error('Lỗi khi từ chối báo cáo: ' + error.message);
    }
  },

  xoa: async (id) => {
    try {
      await deleteDoc(doc(db, BAO_CAO_COLLECTION, id));
      return true;
    } catch (error) {
      throw new Error('Lỗi khi xóa báo cáo: ' + error.message);
    }
  }
};

export default baoCaoApi;