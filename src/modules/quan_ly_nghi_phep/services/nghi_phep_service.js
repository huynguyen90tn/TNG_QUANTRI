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
import { TRANG_THAI_DON } from '../constants/trang_thai_don';

const COLLECTION_NAME = 'leave_requests';

const generateLeaveRequestId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LR${year}${month}${day}${randomId}`;
};

const validateLeaveRequestData = (data) => {
  const requiredFields = ['userId', 'startDate', 'endDate', 'reason', 'leaveType'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Thiếu thông tin bắt buộc: ${missingFields.join(', ')}`);
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Ngày không hợp lệ');
  }

  if (startDate < today) {
    throw new Error('Ngày bắt đầu không thể là ngày trong quá khứ');
  }

  if (endDate < startDate) {
    throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
  }

  return true;
};

const validateApproverData = (data) => {
  const requiredFields = ['status', 'approverId', 'approverName', 'approverRole'];
  const missingFields = requiredFields.filter(field => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Thiếu thông tin người phê duyệt: ${missingFields.join(', ')}`);
  }

  const validStatuses = [
    TRANG_THAI_DON.DA_DUYET,
    TRANG_THAI_DON.TU_CHOI,
    TRANG_THAI_DON.HUY
  ];

  if (!validStatuses.includes(data.status)) {
    throw new Error('Trạng thái không hợp lệ');
  }

  if (data.status === TRANG_THAI_DON.DA_DUYET && data.approverRole !== 'admin-tong') {
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
    const errorMessage = 'Lỗi chuyển đổi ngày: ' + error.message;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const mapLeaveRequestData = (docSnapshot) => {
  if (!docSnapshot?.exists()) return null;

  const data = docSnapshot.data();
  
  return {
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
    status: data.status || TRANG_THAI_DON.CHO_DUYET,
    approverNote: data.approverNote || '',
    approverId: data.approverId || null,
    approverName: data.approverName || '',
    approverRole: data.approverRole || '',
    approverEmail: data.approverEmail || '',
    approverDepartment: data.approverDepartment || '',
    linkTaiLieu: data.linkTaiLieu || '',
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    ...(data.approvedAt && { approvedAt: data.approvedAt.toDate() }),
    ...(data.createdAt && { createdAt: data.createdAt.toDate() }),
    ...(data.updatedAt && { updatedAt: data.updatedAt.toDate() })
  };
};

const nghiPhepService = {
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
        status: TRANG_THAI_DON.CHO_DUYET,
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
      // eslint-disable-next-line no-console
      console.error('Chi tiết lỗi khi tạo đơn:', error);
      throw error;
    }
  },

  async layDanhSach(filters = {}) {
    try {
      const conditions = [];
      const queryRef = collection(db, COLLECTION_NAME);

      Object.entries(filters).forEach(([key, value]) => {
        if (!value) return;

        switch (key) {
          case 'userId':
          case 'department':
          case 'status':
            conditions.push(where(key, '==', value));
            break;
          case 'startDate':
            conditions.push(where('startDate', '>=', formatDateForFirestore(value)));
            break;
          case 'endDate':
            conditions.push(where('endDate', '<=', formatDateForFirestore(value)));
            break;
          default:
            break;
        }
      });

      const q = query(queryRef, ...conditions, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(mapLeaveRequestData).filter(Boolean);
    } catch (error) {
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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

      await updateDoc(docRef, dataToUpdate);
      const updatedDoc = await getDoc(docRef);
      return mapLeaveRequestData(updatedDoc);
    } catch (error) {
      // eslint-disable-next-line no-console
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
        status: TRANG_THAI_DON.HUY,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await getDoc(docRef);
      return mapLeaveRequestData(updatedDoc);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Chi tiết lỗi khi hủy đơn:', error);
      throw error;
    }
  },
};

export default nghiPhepService;