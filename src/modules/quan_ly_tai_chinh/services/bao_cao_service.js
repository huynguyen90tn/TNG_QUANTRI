 
// File: src/modules/quan_ly_tai_chinh/services/tai_chinh_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { 
    collection, 
    addDoc, 
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    Timestamp 
  } from 'firebase/firestore';
  import { db } from '../../../services/firebase';
  
  export const taiChinhService = {
    async themNguonThu(duLieu) {
      try {
        const docRef = await addDoc(collection(db, 'nguon_thu'), {
          ...duLieu,
          ngayTao: Timestamp.now(),
          ngayCapNhat: Timestamp.now()
        });
        return { id: docRef.id, ...duLieu };
      } catch (error) {
        throw new Error('Lỗi khi thêm nguồn thu: ' + error.message);
      }
    },
  
    async themChiTieu(duLieu) {
      try {
        const docRef = await addDoc(collection(db, 'chi_tieu'), {
          ...duLieu,
          ngayTao: Timestamp.now(),
          ngayCapNhat: Timestamp.now()
        });
        return { id: docRef.id, ...duLieu };
      } catch (error) {
        throw new Error('Lỗi khi thêm chi tiêu: ' + error.message);
      }
    },
  
    async capNhatNguonThu(id, duLieu) {
      try {
        const docRef = doc(db, 'nguon_thu', id);
        await updateDoc(docRef, {
          ...duLieu,
          ngayCapNhat: Timestamp.now()
        });
        return { id, ...duLieu };
      } catch (error) {
        throw new Error('Lỗi khi cập nhật nguồn thu: ' + error.message);
      }
    },
  
    async capNhatChiTieu(id, duLieu) {
      try {
        const docRef = doc(db, 'chi_tieu', id);
        await updateDoc(docRef, {
          ...duLieu,
          ngayCapNhat: Timestamp.now()
        });
        return { id, ...duLieu };
      } catch (error) {
        throw new Error('Lỗi khi cập nhật chi tiêu: ' + error.message);
      }
    },
  
    async xoaNguonThu(id) {
      try {
        await deleteDoc(doc(db, 'nguon_thu', id));
        return id;
      } catch (error) {
        throw new Error('Lỗi khi xóa nguồn thu: ' + error.message);
      }
    },
  
    async xoaChiTieu(id) {
      try {
        await deleteDoc(doc(db, 'chi_tieu', id));
        return id;
      } catch (error) {
        throw new Error('Lỗi khi xóa chi tiêu: ' + error.message);
      }
    },
  
    async layDanhSachNguonThu(boLoc = {}) {
      try {
        const { tuNgay, denNgay, loaiThu } = boLoc;
        let q = collection(db, 'nguon_thu');
        
        const dieuKien = [];
        
        if (tuNgay) {
          dieuKien.push(where('ngayTao', '>=', tuNgay));
        }
        
        if (denNgay) {
          dieuKien.push(where('ngayTao', '<=', denNgay));
        }
        
        if (loaiThu && loaiThu !== 'TAT_CA') {
          dieuKien.push(where('loaiThu', '==', loaiThu));
        }
        
        if (dieuKien.length > 0) {
          q = query(q, ...dieuKien);
        }
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        throw new Error('Lỗi khi lấy danh sách nguồn thu: ' + error.message);
      }
    }
  };
  
  export default taiChinhService;