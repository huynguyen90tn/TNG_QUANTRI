// File: src/services/api/bao_cao_api.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';

const BAO_CAO_COLLECTION = 'bao_cao';
const USERS_COLLECTION = 'users'; 
const REMINDERS_COLLECTION = 'reminders';

const isValidEmail = (email) => {
  return Boolean(email && typeof email === 'string' && email.includes('@'));
};

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

const formatDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatEndDate = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const baoCaoApi = {
  layDanhSach: async (filters = {}, sortBy = {}, pagination = {}) => {
    try {
      const conditions = [orderBy('ngayTao', 'desc')];

      if (filters.email && isValidEmail(filters.email)) {
        conditions.push(
          where('nguoiTaoInfo.email', '==', filters.email.toLowerCase().trim())
        );
      }

      if (filters.userId) {
        conditions.push(where('nguoiTaoInfo.userId', '==', filters.userId));
      }

      if (filters.phanHe) {
        conditions.push(where('phanHe', '==', filters.phanHe));
      }

      if (filters.trangThai) {
        conditions.push(where('trangThai', '==', filters.trangThai));
      }

      if (filters.tuNgay && isValidDate(new Date(filters.tuNgay))) {
        conditions.push(
          where('ngayTao', '>=', Timestamp.fromDate(formatDate(filters.tuNgay)))
        );
      }

      if (filters.denNgay && isValidDate(new Date(filters.denNgay))) {
        conditions.push(
          where('ngayTao', '<=', Timestamp.fromDate(formatEndDate(filters.denNgay)))
        );
      }

      const reportQuery = query(
        collection(db, BAO_CAO_COLLECTION),
        ...conditions,
        limit(100)
      );

      const snapshot = await getDocs(reportQuery);
      let reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ngayTao: doc.data().ngayTao?.toDate()?.toISOString(),
        ngayCapNhat: doc.data().ngayCapNhat?.toDate()?.toISOString()
      }));

      if (filters.tuKhoa) {
        const keyword = filters.tuKhoa.toLowerCase().trim();
        reports = reports.filter(report => 
          report.tieuDe?.toLowerCase().includes(keyword) ||
          report.nguoiTaoInfo?.memberCode?.toLowerCase().includes(keyword) ||
          report.noiDung?.toLowerCase().includes(keyword)
        );
      }

      if (filters.loaiBaoCao) {
        reports = reports.filter(report => 
          report.loaiBaoCao === filters.loaiBaoCao
        );
      }

      if (sortBy.truong && typeof sortBy.truong === 'string') {
        reports.sort((a, b) => {
          const fieldA = a[sortBy.truong];
          const fieldB = b[sortBy.truong];

          if (!fieldA && !fieldB) return 0;
          if (!fieldA) return 1;
          if (!fieldB) return -1;

          const compareResult = fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
          return sortBy.huong === 'desc' ? -compareResult : compareResult;
        });
      }

      const { trang = 1, soLuong = 10 } = pagination;
      const start = (trang - 1) * soLuong;
      const end = start + soLuong;
      const paginatedData = reports.slice(start, end);

      return {
        data: paginatedData,
        total: reports.length,
        hasMore: end < reports.length
      };

    } catch (error) {
      console.error('Lỗi lấy danh sách báo cáo:', error);
      throw new Error('Không thể lấy danh sách báo cáo: ' + error.message);
    }
  },

  getNguoiChuaBaoCao: async ({ date = new Date(), type = 'daily' } = {}) => {
    try {
      if (!isValidDate(date)) {
        throw new Error('Ngày không hợp lệ');
      }

      const usersQuery = query(
        collection(db, USERS_COLLECTION),
        where('status', '==', 'active'),
        where('role', '==', 'member')
      );

      const usersSnapshot = await getDocs(usersQuery);
      const allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email?.toLowerCase().trim(),
        ...doc.data()
      }));

      const startTime = formatDate(date);
      const endTime = new Date(date);
      
      if (type === 'monthly') {
        endTime.setMonth(endTime.getMonth() + 1, 0);
      }
      endTime.setHours(23, 59, 59, 999);

      const reportQuery = query(
        collection(db, BAO_CAO_COLLECTION),
        where('ngayTao', '>=', Timestamp.fromDate(startTime)),
        where('ngayTao', '<=', Timestamp.fromDate(endTime)),
        where('loaiBaoCao', '==', 'bao-cao-ngay')
      );

      const reportSnapshot = await getDocs(reportQuery);
      const reportedUsers = new Set();

      reportSnapshot.forEach(doc => {
        const data = doc.data();
        if (data?.nguoiTaoInfo?.userId) {
          reportedUsers.add(data.nguoiTaoInfo.userId);
        }
      });

      return allUsers
        .filter(user => !reportedUsers.has(user.id))
        .map(user => ({
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

  guiNhacNho: async (userIds, nguoiGuiInfo) => {
    try {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new Error('Danh sách người dùng không hợp lệ');
      }

      if (!nguoiGuiInfo?.id) {
        throw new Error('Thiếu thông tin người gửi nhắc nhở');
      }

      const reminderData = {
        userIds,
        nguoiGuiInfo,
        loai: 'bao-cao-ngay',
        thoiGian: serverTimestamp(),
        trangThai: 'da_gui'
      };

      await addDoc(collection(db, REMINDERS_COLLECTION), reminderData);
      return true;

    } catch (error) {
      console.error('Lỗi gửi nhắc nhở:', error);
      throw new Error('Không thể gửi nhắc nhở: ' + error.message);
    }
  },

  taoMoi: async (data) => {
    try {
      if (!data?.nguoiTaoInfo?.userId || !isValidEmail(data?.nguoiTaoInfo?.email)) {
        throw new Error('Thiếu thông tin người tạo báo cáo');
      }

      const baoCaoData = {
        ...data,
        ngayTao: serverTimestamp(),
        ngayCapNhat: serverTimestamp(),
        trangThai: 'cho_duyet'
      };

      const docRef = await addDoc(collection(db, BAO_CAO_COLLECTION), baoCaoData);
      const newDoc = await getDoc(docRef);

      if (!newDoc.exists()) {
        throw new Error('Không thể tạo báo cáo');
      }

      return {
        id: docRef.id,
        ...newDoc.data(),
        ngayTao: newDoc.data().ngayTao?.toDate()?.toISOString(),
        ngayCapNhat: newDoc.data().ngayCapNhat?.toDate()?.toISOString()
      };

    } catch (error) {
      console.error('Lỗi tạo báo cáo:', error);
      throw new Error('Không thể tạo báo cáo: ' + error.message);
    }
  },

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
        id: updatedDoc.id,
        ...updatedData,
        ngayCapNhat: updatedData.ngayCapNhat?.toDate()?.toISOString()
      };

    } catch (error) {
      console.error('Lỗi cập nhật báo cáo:', error);
      throw new Error('Không thể cập nhật báo cáo: ' + error.message);
    }
  },

  duyetBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
      if (!id) {
        throw new Error('Thiếu ID báo cáo');
      }

      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        trangThai: 'da_duyet',
        ngayCapNhat: serverTimestamp(),
        ghiChu: ghiChu.trim(),
        nguoiDuyetInfo: nguoiDuyet
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id: updatedDoc.id,
        ...updatedData,
        ngayCapNhat: updatedData.ngayCapNhat?.toDate()?.toISOString()
      };

    } catch (error) {
      console.error('Lỗi duyệt báo cáo:', error);
      throw new Error('Không thể duyệt báo cáo: ' + error.message);
    }
  },

  tuChoiBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
      if (!id) {
        throw new Error('Thiếu ID báo cáo');
      }

      const docRef = doc(db, BAO_CAO_COLLECTION, id);
      const updateData = {
        trangThai: 'tu_choi',
        ngayCapNhat: serverTimestamp(),
        ghiChu: ghiChu.trim(),
        nguoiDuyetInfo: nguoiDuyet
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id: updatedDoc.id,
        ...updatedData,
        ngayCapNhat: updatedData.ngayCapNhat?.toDate()?.toISOString()
      };

    } catch (error) {
      console.error('Lỗi từ chối báo cáo:', error);
      throw new Error('Không thể từ chối báo cáo: ' + error.message);
    }
  },

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