// File: src/modules/quan_ly_tai_chinh/services/tai_chinh_service.js
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
  
    async layTongQuanTaiChinh() {
      try {
        // Lấy tất cả nguồn thu
        const nguonThuRef = collection(db, 'nguon_thu');
        const nguonThuSnapshot = await getDocs(nguonThuRef);
        const nguonThu = nguonThuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        // Lấy tất cả chi tiêu
        const chiTieuRef = collection(db, 'chi_tieu');
        const chiTieuSnapshot = await getDocs(chiTieuRef);
        const chiTieu = chiTieuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        const tongThu = nguonThu.reduce((sum, item) => sum + item.soTien, 0);
        const tongChi = chiTieu.reduce((sum, item) => sum + item.soTien, 0);
  
        return {
          tongThu,
          tongChi,
          tonKho: tongThu - tongChi,
          soLuongGiaoDich: nguonThu.length + chiTieu.length
        };
  
      } catch (error) {
        throw new Error('Lỗi khi lấy tổng quan tài chính: ' + error.message);
      }
    }
  };
  
  export default taiChinhService;