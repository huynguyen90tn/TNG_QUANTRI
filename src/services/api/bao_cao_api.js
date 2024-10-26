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
  limit
} from "firebase/firestore";

const BAO_CAO_COLLECTION = 'bao_cao';

export const baoCaoApi = {
  taoMoi: async (data) => {
    try {
      const docRef = await addDoc(collection(db, BAO_CAO_COLLECTION), {
        ...data,
        ngayTao: Timestamp.now(),
        ngayCapNhat: Timestamp.now(),
        trangThai: 'cho_duyet'
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error('Lỗi khi tạo báo cáo: ' + error.message);
    }
  },

  capNhat: async (id, data) => {
    try {
      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        ngayCapNhat: Timestamp.now()
      });
      return { id, ...data };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật báo cáo: ' + error.message);
    }
  },

  xoa: async (id) => {
    try {
      await deleteDoc(doc(db, BAO_CAO_COLLECTION, id));
      return true;
    } catch (error) {
      throw new Error('Lỗi khi xóa báo cáo: ' + error.message);
    }
  },

  layChiTiet: async (id) => {
    try {
      const docSnap = await getDoc(doc(db, BAO_CAO_COLLECTION, id));
      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy báo cáo');
      }
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      throw new Error('Lỗi khi lấy chi tiết báo cáo: ' + error.message);
    }
  },

  layDanhSach: async (filters = {}, sapXep = {}, phanTrang = {}) => {
    try {
      // Chỉ lấy 100 báo cáo mới nhất và xử lý lọc ở client
      const q = query(
        collection(db, BAO_CAO_COLLECTION), 
        orderBy('ngayTao', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      let baoCao = [];
      
      snapshot.forEach((doc) => {
        baoCao.push({
          id: doc.id,
          ...doc.data(),
          ngayTao: doc.data().ngayTao?.toDate()?.toISOString(),
          ngayCapNhat: doc.data().ngayCapNhat?.toDate()?.toISOString()
        });
      });

      // Lọc dữ liệu phía client
      if (filters.loaiBaoCao) {
        baoCao = baoCao.filter(item => item.loaiBaoCao === filters.loaiBaoCao);
      }

      if (filters.phanHe) {
        baoCao = baoCao.filter(item => item.phanHe === filters.phanHe);
      }

      if (filters.trangThai) {
        baoCao = baoCao.filter(item => item.trangThai === filters.trangThai);
      }

      if (filters.nguoiTao) {
        baoCao = baoCao.filter(item => item.nguoiTao === filters.nguoiTao);
      }

      if (filters.tuNgay) {
        const tuNgay = new Date(filters.tuNgay);
        baoCao = baoCao.filter(item => new Date(item.ngayTao) >= tuNgay);
      }

      if (filters.denNgay) {
        const denNgay = new Date(filters.denNgay);
        baoCao = baoCao.filter(item => new Date(item.ngayTao) <= denNgay);
      }

      // Tính toán phân trang
      const startIndex = (phanTrang.trang - 1) * phanTrang.soLuong || 0;
      const endIndex = startIndex + (phanTrang.soLuong || 10);

      return {
        data: baoCao.slice(startIndex, endIndex),
        hasMore: endIndex < baoCao.length,
        total: baoCao.length
      };

    } catch (error) {
      throw new Error('Lỗi khi tải danh sách báo cáo: ' + error.message);
    }
  },

  duyetBaoCao: async (id, ghiChu = '', nguoiDuyet) => {
    try {
      await updateDoc(doc(db, BAO_CAO_COLLECTION, id), {
        trangThai: 'da_duyet',
        ngayCapNhat: Timestamp.now(),
        nguoiDuyet,
        ghiChu
      });
      return true;
    } catch (error) {
      throw new Error('Lỗi khi duyệt báo cáo: ' + error.message);
    }
  },

  tuChoiBaoCao: async (id, ghiChu = '', nguoiDuyet) => {
    try {
      await updateDoc(doc(db, BAO_CAO_COLLECTION, id), {
        trangThai: 'tu_choi',
        ngayCapNhat: Timestamp.now(),
        nguoiDuyet,
        ghiChu
      });
      return true;
    } catch (error) {
      throw new Error('Lỗi khi từ chối báo cáo: ' + error.message); 
    }
  }
};