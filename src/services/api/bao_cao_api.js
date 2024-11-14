// File: src/services/api/baoCaoApi.js
// Link tham khảo: https://firebase.google.com/docs/firestore/manage-data/add-data
// Nhánh: main

import { db } from '../firebase';
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
  where,
  serverTimestamp 
} from 'firebase/firestore';

const BAO_CAO_COLLECTION = 'bao_cao';
const USERS_COLLECTION = 'users';
const REMINDERS_COLLECTION = 'reminders';

/**
 * Lấy user hiện tại từ localStorage 
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Lỗi khi parse currentUser:', error);
    return null;
  }
};

/**
 * Chuẩn hóa email thành lowercase và bỏ khoảng trắng
 */
const normalizeEmail = (email) => {
  return email?.toLowerCase().trim() || ''; 
};

/**
 * API tương tác với collection bao_cao
 */
export const baoCaoApi = {

  /**
   * Tạo báo cáo mới
   */
  taoMoi: async (data) => {
    try {
      const currentUser = getCurrentUser();

      // Validate dữ liệu đầu vào
      if (!data) {
        throw new Error('Thiếu dữ liệu báo cáo');
      }

      const baoCaoData = {
        ...data,
        ngayTao: serverTimestamp(),
        ngayCapNhat: serverTimestamp(),
        trangThai: 'cho_duyet',
        nguoiTaoInfo: {
          ...data.nguoiTaoInfo,
          email: normalizeEmail(currentUser?.email || data.nguoiTaoInfo?.email)
        }
      };

      const docRef = await addDoc(collection(db, BAO_CAO_COLLECTION), baoCaoData);
      const newDoc = await getDoc(docRef);
      
      if (!newDoc.exists()) {
        throw new Error('Không thể tạo báo cáo');
      }

      const newData = newDoc.data();
      return {
        id: docRef.id,
        ...newData,
        ngayTao: newData.ngayTao?.toDate()?.toISOString(),
        ngayCapNhat: newData.ngayCapNhat?.toDate()?.toISOString()
      };

    } catch (error) {
      console.error('Lỗi tạo báo cáo:', error);
      throw new Error('Không thể tạo báo cáo: ' + error.message);
    }
  },

  /**
   * Lấy danh sách báo cáo theo bộ lọc
   */
  layDanhSach: async (filters = {}, sapXep = {}, phanTrang = {}) => {
    try {
      // Build query với điều kiện lọc
      const conditions = [orderBy('ngayTao', 'desc')];
      
      if (filters.email) {
        conditions.push(where('nguoiTaoInfo.email', '==', normalizeEmail(filters.email)));
      }

      const q = query(
        collection(db, BAO_CAO_COLLECTION),
        ...conditions,
        limit(100)
      );

      const snapshot = await getDocs(q);
      
      // Map dữ liệu và format timestamp 
      let baoCao = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ngayTao: doc.data().ngayTao?.toDate()?.toISOString(),
        ngayCapNhat: doc.data().ngayCapNhat?.toDate()?.toISOString()
      }));

      // Lọc client-side
      if (filters.loaiBaoCao) {
        baoCao = baoCao.filter(item => item.loaiBaoCao === filters.loaiBaoCao);
      }
      
      if (filters.phanHe) {
        baoCao = baoCao.filter(item => item.phanHe === filters.phanHe);
      }

      if (filters.trangThai) {
        baoCao = baoCao.filter(item => item.trangThai === filters.trangThai);
      }

      // Lọc theo ngày
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
          if (!item.ngayTao) return false;
          const ngayBaoCao = new Date(item.ngayTao);
          return ngayBaoCao.toDateString() === ngayFilter.toDateString();
        });
      }

      // Phân trang
      const startIndex = ((phanTrang.trang || 1) - 1) * (phanTrang.soLuong || 10);
      const endIndex = startIndex + (phanTrang.soLuong || 10);

      return {
        data: baoCao.slice(startIndex, endIndex),
        total: baoCao.length,
        hasMore: endIndex < baoCao.length
      };

    } catch (error) {
      console.error('Lỗi lấy danh sách báo cáo:', error);
      throw new Error('Không thể lấy danh sách báo cáo: ' + error.message);
    }
  },

  /**
   * Kiểm tra báo cáo ngày của user
   */
  kiemTraBaoCaoNgay: async (email, ngay) => {
    try {
      if (!email || !ngay) return false;

      const startOfDay = new Date(ngay);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(ngay); 
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, BAO_CAO_COLLECTION),
        where('nguoiTaoInfo.email', '==', normalizeEmail(email)),
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

  /**
   * Lấy danh sách người chưa báo cáo
   */
  getNguoiChuaBaoCao: async ({ date, type = 'daily' }) => {
    try {
      if (!date) {
        throw new Error('Thiếu ngày kiểm tra');
      }

      // Lấy danh sách thành viên active
      const usersQuery = query(
        collection(db, USERS_COLLECTION),
        where('status', '==', 'active'),
        where('role', '==', 'member')
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      const allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        email: normalizeEmail(doc.data().email),
        ...doc.data()
      }));

      // Set thời gian kiểm tra
      const selectedDate = new Date(date);
      const startTime = new Date(selectedDate);
      const endTime = new Date(selectedDate);

      if (type === 'daily') {
        startTime.setHours(0, 0, 0, 0);
        endTime.setHours(23, 59, 59, 999);
      } else {
        startTime.setDate(1);
        endTime.setMonth(endTime.getMonth() + 1, 0); 
        endTime.setHours(23, 59, 59, 999);
      }

      // Lấy báo cáo trong khoảng thời gian
      const reportQuery = query(
        collection(db, BAO_CAO_COLLECTION),
        where('ngayTao', '>=', Timestamp.fromDate(startTime)),
        where('ngayTao', '<=', Timestamp.fromDate(endTime))
      );

      const reportSnapshot = await getDocs(reportQuery);
      const reportedEmails = new Set();

      reportSnapshot.forEach(doc => {
        const email = normalizeEmail(doc.data()?.nguoiTaoInfo?.email);
        if (email) {
          reportedEmails.add(email);
        }
      });

      // Lọc người chưa báo cáo
      const notReported = allUsers.filter(user => {
        const hasReported = reportedEmails.has(normalizeEmail(user.email)); 
        return !hasReported;
      });

      // Map dữ liệu trả về
      return notReported.map(user => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        position: user.position,
        memberCode: user.memberCode,
        avatar: user.avatar
      }));

    } catch (error) {
      console.error('Lỗi lấy danh sách người chưa báo cáo:', error);
      throw new Error('Không thể lấy danh sách người chưa báo cáo: ' + error.message);
    }
  },

  /**
   * Gửi nhắc nhở cho user chưa báo cáo
   */
  guiNhacNho: async (userIds) => {
    try {
      if (!Array.isArray(userIds) || !userIds.length) {
        throw new Error('Danh sách userIds không hợp lệ');  
      }

      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Chưa đăng nhập');
      }

      // Lưu lịch sử nhắc nhở
      await addDoc(collection(db, REMINDERS_COLLECTION), {
        userIds,
        nguoiGui: normalizeEmail(currentUser.email),
        thoiGian: serverTimestamp()
      });

      return true;

    } catch (error) {
      console.error('Lỗi gửi nhắc nhở:', error);
      throw new Error('Không thể gửi nhắc nhở: ' + error.message);
    }
  },

  /**
   * Lấy chi tiết báo cáo
   */
  layChiTiet: async (id) => {
    try {
      if (!id) {
        throw new Error('Thiếu ID báo cáo');
      }

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
      console.error('Lỗi lấy chi tiết báo cáo:', error);
      throw new Error('Không thể lấy chi tiết báo cáo: ' + error.message); 
    }
  },

  /**
   * Cập nhật báo cáo
   */
  capNhat: async (id, data) => {
    try {
      if (!id || !data) {
        throw new Error('Thiếu dữ liệu cập nhật');
      }

      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        ...data,
        ngayCapNhat: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id,
        ...updatedData,
        ngayCapNhat: updatedData.ngayCapNhat?.toDate()?.toISOString()
      };

    } catch (error) {
      console.error('Lỗi cập nhật báo cáo:', error);
      throw new Error('Không thể cập nhật báo cáo: ' + error.message);
    }
  },

  /**
   * Duyệt báo cáo
   */
  duyetBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
      if (!id) {
        throw new Error('Thiếu ID báo cáo');
      }

      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        trangThai: 'da_duyet',
        ngayCapNhat: serverTimestamp(),
        ghiChu,
        nguoiDuyet: normalizeEmail(nguoiDuyet)
      };

      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id,
        ...updatedData,
        ngayCapNhat: updatedData.ngayCapNhat?.toDate()?.toISOString()
      };

    } catch (error) {
      console.error('Lỗi duyệt báo cáo:', error);
      throw new Error('Không thể duyệt báo cáo: ' + error.message);
    }
  },

  /**  
   * Từ chối báo cáo
   */
  tuChoiBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
      if (!id) {
        throw new Error('Thiếu ID báo cáo');
      }

      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        trangThai: 'tu_choi',
        ngayCapNhat: serverTimestamp(), 
        ghiChu,
        nguoiDuyet: normalizeEmail(nguoiDuyet)
      };

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id,
        ...updatedData,ngayCapNhat: updatedData.ngayCapNhat?.toDate()?.toISOString()
      };
 
    } catch (error) {
      console.error('Lỗi từ chối báo cáo:', error);
      throw new Error('Không thể từ chối báo cáo: ' + error.message);
    }
  },
 
  /**
   * Xóa báo cáo
   */
  xoa: async (id) => {
    try {
      if (!id) {
        throw new Error('Thiếu ID báo cáo');
      }
 
      await deleteDoc(doc(db, BAO_CAO_COLLECTION, id));
      return true;
 
    } catch (error) {
      console.error('Lỗi xóa báo cáo:', error); 
      throw new Error('Không thể xóa báo cáo: ' + error.message);
    }
  }
 };
 
 export default baoCaoApi;