// File: src/modules/quan_ly_nghi_phep/services/nghi_phep_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore/manage-data/add-data
// Link tham khảo về rules: https://firebase.google.com/docs/firestore/security/rules-structure

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../services/firebase';

const COLLECTION_NAME = 'leave_requests';

const generateLeaveRequestId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `LR${year}${month}${day}${timestamp}`;
};

const validateLeaveRequestData = (data) => {
  const requiredFields = ['userId', 'startDate', 'endDate', 'reason', 'leaveType'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Thiếu thông tin bắt buộc: ${field}`);
    }
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Ngày không hợp lệ');
  }

  if (startDate > endDate) {
    throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
  }

  return true;
};

const validateApproverData = (data) => {
  const requiredFields = ['status', 'approverId', 'approverName', 'approverRole'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Thiếu thông tin người phê duyệt: ${field}`);
    }
  }

  if (!['DA_DUYET', 'TU_CHOI', 'HUY'].includes(data.status)) {
    throw new Error('Trạng thái không hợp lệ');
  }

  if (data.status === 'DA_DUYET' && data.approverRole !== 'admin-tong') {
    throw new Error('Không có quyền phê duyệt');
  }

  return true;
};

const formatDateForFirestore = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Ngày không hợp lệ');
    }
    return Timestamp.fromDate(date);
  } catch (error) {
    console.error('Lỗi chuyển đổi ngày:', error);
    throw error;
  }
};

const mapLeaveRequestData = (docSnapshot) => {
  if (!docSnapshot?.exists()) return null;

  const data = docSnapshot.data();

  const mappedData = {
    id: docSnapshot.id,
    requestId: data.requestId || '',
    userId: data.userId || '',
    userName: data.userName || '',
    userEmail: data.userEmail || '',
    maSoNhanVien: data.maSoNhanVien || '',
    hoTen: data.hoTen || '',
    department: data.department || '',
    phongBan: data.phongBan || '',
    leaveType: data.leaveType || '',
    startDate: data.startDate?.toDate() || null,
    endDate: data.endDate?.toDate() || null,
    totalDays: data.totalDays || 0,
    reason: data.reason || '',
    status: data.status || 'CHO_DUYET',
    approverNote: data.approverNote || '',
    approverId: data.approverId || null,
    approverName: data.approverName || '',
    approverRole: data.approverRole || '',
    approverEmail: data.approverEmail || '',
    approverDepartment: data.approverDepartment || '',
    linkTaiLieu: data.linkTaiLieu || '',
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
  };

  if (data.approvedAt) {
    mappedData.approvedAt = data.approvedAt.toDate();
  }
  if (data.createdAt) {
    mappedData.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt) {
    mappedData.updatedAt = data.updatedAt.toDate();
  }

  return mappedData;
};

export const nghiPhepService = {
  async themDon(data) {
    try {
      validateLeaveRequestData(data);

      const cleanedData = {
        requestId: generateLeaveRequestId(),
        userId: data.userId,
        userName: data.userName || '',
        userEmail: data.userEmail || '',
        maSoNhanVien: data.maSoNhanVien || '',
        hoTen: data.hoTen || '',
        department: data.department || '',
        phongBan: data.phongBan || '',
        leaveType: data.leaveType,
        startDate: formatDateForFirestore(data.startDate),
        endDate: formatDateForFirestore(data.endDate),
        totalDays: data.totalDays || 1,
        reason: data.reason,
        status: 'CHO_DUYET',
        approverNote: '',
        approverId: null,
        approverName: '',
        approverRole: '',
        approverEmail: '',
        approverDepartment: '',
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
        linkTaiLieu: data.linkTaiLieu || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedData);
      const newDoc = await getDoc(docRef);

      if (!newDoc.exists()) {
        throw new Error('Lỗi khi tạo đơn: Không thể lưu dữ liệu');
      }

      return mapLeaveRequestData(newDoc);
    } catch (error) {
      console.error('Chi tiết lỗi khi tạo đơn:', error);
      throw error;
    }
  },

  async layDanhSach(filters = {}) {
    try {
      const conditions = [];
      const queryRef = collection(db, COLLECTION_NAME);

      if (filters.userId) {
        conditions.push(where('userId', '==', filters.userId));
      }
      if (filters.department) {
        conditions.push(where('department', '==', filters.department));
      }
      if (filters.status) {
        conditions.push(where('status', '==', filters.status));
      }
      if (filters.startDate) {
        const startTimestamp = formatDateForFirestore(filters.startDate);
        conditions.push(where('startDate', '>=', startTimestamp));
      }
      if (filters.endDate) {
        const endTimestamp = formatDateForFirestore(filters.endDate);
        conditions.push(where('endDate', '<=', endTimestamp));
      }

      const q = query(queryRef, ...conditions, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(mapLeaveRequestData).filter(Boolean);
    } catch (error) {
      console.error('Chi tiết lỗi khi lấy danh sách:', error);
      throw error;
    }
  },

  async layChiTiet(id) {
    try {
      if (!id) throw new Error('ID không hợp lệ');

      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy đơn xin nghỉ phép');
      }

      return mapLeaveRequestData(docSnap);
    } catch (error) {
      console.error('Chi tiết lỗi khi lấy chi tiết:', error);
      throw error;
    }
  },

  async capNhatTrangThai(id, updateData) {
    try {
      validateApproverData(updateData);

      if (!id) throw new Error('ID không hợp lệ');

      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy đơn xin nghỉ phép');
      }

      const dataToUpdate = {
        status: updateData.status,
        approverNote: updateData.approverNote || '',
        approverId: updateData.approverId,
        approverName: updateData.approverName,
        approverRole: updateData.approverRole,
        approverEmail: updateData.approverEmail || '',
        approverDepartment: updateData.approverDepartment || '',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('Dữ liệu cập nhật:', dataToUpdate);

      await updateDoc(docRef, dataToUpdate);
      const updatedDoc = await getDoc(docRef);
      return mapLeaveRequestData(updatedDoc);
    } catch (error) {
      console.error('Chi tiết lỗi khi cập nhật trạng thái:', error);
      throw error;
    }
  },

  async huyDon(id) {
    try {
      if (!id) throw new Error('ID không hợp lệ');

      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy đơn xin nghỉ phép');
      }

      const updateData = {
        status: 'HUY',
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await getDoc(docRef);
      return mapLeaveRequestData(updatedDoc);
    } catch (error) {
      console.error('Chi tiết lỗi khi hủy đơn:', error);
      throw error;
    }
  },
};

export default nghiPhepService;
