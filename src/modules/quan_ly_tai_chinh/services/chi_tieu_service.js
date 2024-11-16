// File: src/modules/quan_ly_tai_chinh/services/chi_tieu_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { 
  collection,
  doc,
  addDoc,
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../services/firebase';

const COLLECTION_NAME = 'chi_tieu';
const CACHE_TIME = 5 * 60 * 1000; // 5 phút
let cache = {
  data: null,
  timestamp: null
};

export const chiTieuService = {
  async themChiTieu(duLieu) {
    try {
      // Sử dụng serverTimestamp() thay vì Timestamp.now()
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...duLieu,
        ngayTao: serverTimestamp(),
        ngayCapNhat: serverTimestamp(),
        trangThai: duLieu.trangThai || 'CHO_DUYET'
      });

      // Clear cache sau khi thêm mới
      cache = {
        data: null,
        timestamp: null
      };

      return {
        id: docRef.id,
        ...duLieu,
        ngayTao: new Date(),
        ngayCapNhat: new Date()
      };
    } catch (error) {
      throw new Error('Lỗi khi thêm chi tiêu: ' + error.message);
    }
  },

  async layDanhSachChiTieu({ 
    tuNgay, 
    denNgay, 
    loaiChi, 
    trangThai,
    trang = 1,
    soLuong = 10 
  } = {}) {
    try {
      // Kiểm tra cache nếu tham số giống nhau
      const cacheKey = JSON.stringify({tuNgay, denNgay, loaiChi, trangThai, trang, soLuong});
      
      if (cache.data && cache.timestamp && Date.now() - cache.timestamp < CACHE_TIME) {
        if (cache.key === cacheKey) {
          return cache.data;
        }
      }

      let baseQuery = collection(db, COLLECTION_NAME);
      const conditions = [];
      
      // Tối ưu điều kiện query
      if (tuNgay) {
        conditions.push(where('ngayTao', '>=', Timestamp.fromDate(new Date(tuNgay))));
      }

      if (denNgay) {
        conditions.push(where('ngayTao', '<=', Timestamp.fromDate(new Date(denNgay))));
      }

      if (loaiChi && loaiChi !== 'TAT_CA') {
        conditions.push(where('loaiChi', '==', loaiChi));
      }

      if (trangThai && trangThai !== 'TAT_CA') {
        conditions.push(where('trangThai', '==', trangThai));
      }

      // Composite query tối ưu
      let finalQuery = baseQuery;
      if (conditions.length > 0) {
        finalQuery = query(baseQuery, ...conditions);
      }

      // Thêm sắp xếp và phân trang
      finalQuery = query(
        finalQuery,
        orderBy('ngayTao', 'desc'),
        limit(soLuong)
      );

      // Phân trang
      if (trang > 1) {
        const lastDoc = await this.layDocCuoiCung(trang - 1, soLuong, conditions);
        if (lastDoc) {
          finalQuery = query(finalQuery, startAfter(lastDoc));
        }
      }

      const snapshot = await getDocs(finalQuery);
      
      // Xử lý dữ liệu
      const danhSach = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ngayTao: doc.data().ngayTao?.toDate(),
        ngayCapNhat: doc.data().ngayCapNhat?.toDate()
      }));

      const result = {
        danhSach,
        tongSo: snapshot.size,
        trang,
        soLuong
      };

      // Cập nhật cache
      cache = {
        data: result,
        timestamp: Date.now(),
        key: cacheKey
      };

      return result;

    } catch (error) {
      console.error('Error fetching chi tieu:', error);
      throw new Error('Lỗi khi lấy danh sách chi tiêu: ' + error.message); 
    }
  },

  // Các phương thức khác giữ nguyên...
  async capNhatChiTieu(id, duLieu) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...duLieu,
        ngayCapNhat: serverTimestamp()
      });

      // Clear cache
      cache = {
        data: null,
        timestamp: null  
      };

      return {
        id,
        ...duLieu,
        ngayCapNhat: new Date()
      };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật chi tiêu: ' + error.message);
    }
  },

  async xoaChiTieu(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      
      // Clear cache
      cache = {
        data: null,
        timestamp: null
      };
      
      return id;
    } catch (error) {
      throw new Error('Lỗi khi xóa chi tiêu: ' + error.message); 
    }
  },

  async layChiTieu(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          ngayTao: data.ngayTao?.toDate(),
          ngayCapNhat: data.ngayCapNhat?.toDate()
        };
      }
      throw new Error('Không tìm thấy chi tiêu');
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin chi tiêu: ' + error.message);
    }
  }
};

export default chiTieuService;