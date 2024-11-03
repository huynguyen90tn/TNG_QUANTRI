// File: src/modules/quan_ly_nghi_phep/services/nghi_phep_service.js
import { db } from '../../../services/firebase';
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
  Timestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'leave_requests';

const generateLeaveRequestId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `LR${year}${month}${day}${timestamp}`;
};

const mapLeaveRequestData = (docSnapshot) => {
  if (!docSnapshot.exists()) return null;
  
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    requestId: data.requestId,
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    maSoNhanVien: data.maSoNhanVien,
    hoTen: data.hoTen,
    department: data.department,
    phongBan: data.phongBan,
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    totalDays: data.totalDays,
    reason: data.reason,
    status: data.status,
    approverNote: data.approverNote || '',
    approverId: data.approverId || null,
    approverName: data.approverName || null,
    approvedAt: data.approvedAt?.toDate() || null,
    createdAt: data.createdAt?.toDate() || null,
    updatedAt: data.updatedAt?.toDate() || null,
    attachments: data.attachments || [],
    linkTaiLieu: data.linkTaiLieu || ''
  };
};

const formatDateForFirestore = (dateString) => {
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
};

export const nghiPhepService = {
  async themDon(data) {
    try {
      const newData = {
        requestId: generateLeaveRequestId(),
        ...data,
        startDate: formatDateForFirestore(data.startDate),
        endDate: formatDateForFirestore(data.endDate),
        status: 'CHO_DUYET',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newData);
      const newDoc = await getDoc(docRef);
      return mapLeaveRequestData(newDoc);
    } catch (error) {
      console.error('Lỗi khi tạo đơn:', error);
      throw new Error('Không thể tạo đơn xin nghỉ phép');
    }
  },

  async layDanhSach(filters = {}) {
    try {
      let q = collection(db, COLLECTION_NAME);

      const conditions = [];
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
        conditions.push(where('startDate', '>=', formatDateForFirestore(filters.startDate)));
      }
      if (filters.endDate) {
        conditions.push(where('endDate', '<=', formatDateForFirestore(filters.endDate)));
      }

      conditions.push(orderBy('createdAt', 'desc'));

      q = query(q, ...conditions);

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(mapLeaveRequestData)
        .filter(Boolean);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn:', error);
      throw new Error('Không thể lấy danh sách đơn xin nghỉ phép');
    }
  },

  async layChiTiet(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy đơn xin nghỉ phép');
      }

      return mapLeaveRequestData(docSnap);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn:', error);
      throw new Error('Không thể lấy thông tin đơn xin nghỉ phép');
    }
  },

  async capNhatTrangThai(id, { status, approverNote, approverId, approverName }) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        status,
        approverNote: approverNote || '',
        approverId,
        approverName,
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await getDoc(docRef);
      return mapLeaveRequestData(updatedDoc);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      throw new Error('Không thể cập nhật trạng thái đơn');
    }
  },

  async huyDon(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        status: 'HUY',
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await getDoc(docRef);
      return mapLeaveRequestData(updatedDoc);
    } catch (error) {
      console.error('Lỗi khi hủy đơn:', error);
      throw new Error('Không thể hủy đơn xin nghỉ phép');
    }
  }
};

export default nghiPhepService;