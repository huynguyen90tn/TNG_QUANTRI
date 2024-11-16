// File: src/modules/quan_ly_tai_chinh/services/nguon_thu_service.js
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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../services/firebase';

const COLLECTION_NAME = 'nguon_thu';
const CACHE_TIME = 5 * 60 * 1000; // 5 phút
let cache = {
  data: null,
  timestamp: null,
  key: null
};

export const nguonThuService = {
  async themNguonThu(duLieu) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...duLieu,
        ngayTao: serverTimestamp(),
        ngayCapNhat: serverTimestamp(),
        trangThai: duLieu.trangThai || 'CHO_DUYET',
        nguoiTao: duLieu.nguoiTao || null,
        nguoiCapNhat: duLieu.nguoiCapNhat || null
      });

      // Xóa cache sau khi thêm mới
      cache = {
        data: null,
        timestamp: null,
        key: null
      };

      return {
        id: docRef.id,
        ...duLieu,
        ngayTao: new Date(),
        ngayCapNhat: new Date()
      };
    } catch (error) {
      console.error('Lỗi khi thêm nguồn thu:', error);
      throw new Error('Lỗi khi thêm nguồn thu: ' + error.message);
    }
  },

  async capNhatNguonThu(id, duLieu) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...duLieu,
        ngayCapNhat: serverTimestamp()
      });

      // Xóa cache sau khi cập nhật
      cache = {
        data: null,
        timestamp: null,
        key: null
      };

      return {
        id,
        ...duLieu,
        ngayCapNhat: new Date()
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật nguồn thu:', error);
      throw new Error('Lỗi khi cập nhật nguồn thu: ' + error.message);
    }
  },

  async xoaNguonThu(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      
      // Xóa cache sau khi xóa
      cache = {
        data: null,
        timestamp: null,
        key: null
      };

      return id;
    } catch (error) {
      console.error('Lỗi khi xóa nguồn thu:', error);
      throw new Error('Lỗi khi xóa nguồn thu: ' + error.message);
    }
  },

  async layNguonThu(id) {
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
      throw new Error('Không tìm thấy nguồn thu');
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nguồn thu:', error);
      throw new Error('Lỗi khi lấy thông tin nguồn thu: ' + error.message);
    }
  },

  async layDanhSachNguonThu({ 
    tuNgay, 
    denNgay, 
    loaiThu, 
    trangThai,
    trang = 1,
    soLuong = 10 
  } = {}) {
    try {
      // Kiểm tra cache
      const cacheKey = JSON.stringify({tuNgay, denNgay, loaiThu, trangThai, trang, soLuong});
      
      if (cache.data && cache.timestamp && Date.now() - cache.timestamp < CACHE_TIME) {
        if (cache.key === cacheKey) {
          return cache.data;
        }
      }

      let q = collection(db, COLLECTION_NAME);
      const dieuKien = [];

      if (tuNgay) {
        dieuKien.push(where('ngayTao', '>=', new Date(tuNgay)));
      }

      if (denNgay) {
        dieuKien.push(where('ngayTao', '<=', new Date(denNgay)));
      }

      if (loaiThu && loaiThu !== 'TAT_CA') {
        dieuKien.push(where('loaiThu', '==', loaiThu));
      }

      if (trangThai && trangThai !== 'TAT_CA') {
        dieuKien.push(where('trangThai', '==', trangThai));
      }

      if (dieuKien.length > 0) {
        q = query(q, ...dieuKien);
      }

      q = query(q, 
        orderBy('ngayTao', 'desc'),
        limit(soLuong)
      );

      if (trang > 1) {
        const lastVisible = await this.layDocCuoiCung(trang - 1, soLuong, dieuKien);
        if (lastVisible) {
          q = query(q, startAfter(lastVisible));
        }
      }

      const snapshot = await getDocs(q);
      
      const result = {
        danhSach: snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            ngayTao: data.ngayTao?.toDate(),
            ngayCapNhat: data.ngayCapNhat?.toDate()
          };
        }),
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
      console.error('Lỗi khi lấy danh sách nguồn thu:', error);
      throw new Error('Lỗi khi lấy danh sách nguồn thu: ' + error.message);
    }
  },

  async layDocCuoiCung(trang, soLuong, dieuKien = []) {
    const q = query(
      collection(db, COLLECTION_NAME),
      ...dieuKien,
      orderBy('ngayTao', 'desc'),
      limit(trang * soLuong)
    );

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    return docs[docs.length - 1];
  }
};

export default nguonThuService;