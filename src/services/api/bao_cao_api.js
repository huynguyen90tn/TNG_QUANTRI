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
  where,
  serverTimestamp
} from "firebase/firestore";

const BAO_CAO_COLLECTION = 'bao_cao';
const USERS_COLLECTION = 'users';
const REMINDERS_COLLECTION = 'reminders';

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

const normalizeEmail = (email) => {
  return email?.toLowerCase().trim();
};

export const baoCaoApi = {
  taoMoi: async (data) => {
    try {
      const currentUser = getCurrentUser();
      
      const baoCaoData = {
        ...data,
        ngayTao: serverTimestamp(),
        ngayCapNhat: serverTimestamp(),
        trangThai: 'cho_duyet',
        nguoiTaoInfo: {
          ...data.nguoiTaoInfo,
          email: normalizeEmail(currentUser?.email || data.nguoiTaoInfo?.email || ''),
        }
      };

      const docRef = await addDoc(collection(db, BAO_CAO_COLLECTION), baoCaoData);
      const newDoc = await getDoc(docRef);
      const newData = newDoc.data();
      
      return {
        id: docRef.id,
        ...newData,
        ngayTao: newData.ngayTao?.toDate().toISOString(),
        ngayCapNhat: newData.ngayCapNhat?.toDate().toISOString()
      };
    } catch (error) {
      console.error('Create report error:', error);
      throw new Error('Lỗi khi tạo báo cáo: ' + error.message);
    }
  },

  layDanhSach: async (filters = {}, sapXep = {}, phanTrang = {}) => {
    try {
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
      console.error('Get reports list error:', error);
      throw new Error('Lỗi khi tải danh sách báo cáo: ' + error.message);
    }
  },

  kiemTraBaoCaoNgay: async (email, ngay) => {
    try {
      if (!email) return false;

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
      console.log(`Kiểm tra báo cáo của ${email}: ${!snapshot.empty ? 'Đã báo cáo' : 'Chưa báo cáo'}`);
      return !snapshot.empty;
    } catch (error) {
      console.error('Check daily report error:', error);
      return false;
    }
  },

  getNguoiChuaBaoCao: async ({ date, type = 'daily' }) => {
    try {
      // Lấy danh sách all active members
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

      console.log('Total active members:', allUsers.length);

      // Thiết lập thời gian kiểm tra
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

      console.log('Users who reported:', Array.from(reportedEmails));

      // Lọc người chưa báo cáo
      const notReported = allUsers.filter(user => {
        const hasReported = reportedEmails.has(normalizeEmail(user.email));
        console.log(`${user.email}: ${hasReported ? 'Đã báo cáo' : 'Chưa báo cáo'}`);
        return !hasReported;
      });

      console.log('Total users not reported:', notReported.length);

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
      console.error('Get not reported users error:', error);
      throw new Error('Không thể lấy danh sách người chưa báo cáo: ' + error.message);
    }
  },

  guiNhacNho: async (userIds) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error('Chưa đăng nhập');

      // Lưu lịch sử nhắc nhở
      await addDoc(collection(db, REMINDERS_COLLECTION), {
        userIds,
        nguoiGui: normalizeEmail(currentUser.email),
        thoiGian: serverTimestamp()
      });

      // Gửi thông báo (implement theo hệ thống)
      console.log('Gửi nhắc nhở cho:', userIds);

      return true;
    } catch (error) {
      console.error('Send reminder error:', error);
      throw new Error('Không thể gửi nhắc nhở: ' + error.message);
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
      console.error('Get report detail error:', error);
      throw new Error('Lỗi khi lấy chi tiết báo cáo: ' + error.message);
    }
  },

  capNhat: async (id, data) => {
    try {
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
      console.error('Update report error:', error);
      throw new Error('Lỗi khi cập nhật báo cáo: ' + error.message);
    }
  },

  duyetBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
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
      console.error('Approve report error:', error);
      throw new Error('Lỗi khi duyệt báo cáo: ' + error.message);
    }
  },

  tuChoiBaoCao: async (id, ghiChu = '', nguoiDuyet = null) => {
    try {
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
        ...updatedData,
        ngayCapNhat: updatedData.ngayCapNhat?.toDate()?.toISOString()
      };
    } catch (error) {
      console.error('Reject report error:', error);
      throw new Error('Lỗi khi từ chối báo cáo: ' + error.message);
    }
  },

  xoa: async (id) => {
    try {
      await deleteDoc(doc(db, BAO_CAO_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Delete report error:', error);
      throw new Error('Lỗi khi xóa báo cáo: ' + error.message);
    }
  }
};

export default baoCaoApi;