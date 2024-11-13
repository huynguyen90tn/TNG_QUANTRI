// File: src/modules/quan_ly_thanh_vien/services/thanh_vien_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { db } from '../../../services/firebase';
import { 
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

/**
 * Làm sạch dữ liệu thành viên trước khi trả về
 */
const cleanMemberData = (data) => {
  return {
    id: data.id || '',
    memberCode: data.memberCode || '',
    fullName: data.fullName || '',
    email: data.email || '',
    department: data.department || '',
    position: data.position || '', 
    level: data.level || 'THU_SINH',
    status: data.status || 'active',
    joinDate: data.joinDate ? new Date(data.joinDate) : null,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
  };
};

/**
 * Lấy danh sách thành viên với bộ lọc
 */
export const layDanhSach = async (filters = {}) => {
  try {
    console.log('Bắt đầu lấy danh sách thành viên');
    const membersRef = collection(db, 'members');
    const conditions = [];

    if (filters.status) {
      conditions.push(where('status', '==', filters.status));
    }

    if (filters.department) {
      conditions.push(where('department', '==', filters.department)); 
    }

    if (filters.level) {
      conditions.push(where('level', '==', filters.level));
    }

    // Build query
    const q = conditions.length > 0
      ? query(membersRef, ...conditions, orderBy('fullName', 'asc'))
      : query(membersRef, orderBy('fullName', 'asc'));

    const querySnapshot = await getDocs(q);
    console.log('Số lượng thành viên:', querySnapshot.size);

    const members = querySnapshot.docs.map(doc => 
      cleanMemberData({ id: doc.id, ...doc.data() })
    );

    return members;

  } catch (error) {
    console.error('Lỗi khi lấy danh sách thành viên:', error);
    throw new Error('Không thể lấy danh sách thành viên: ' + error.message);
  }
};

/**
 * Lấy danh sách thành viên theo phòng ban
 */
export const layTheoPhongBan = async (department) => {
  try {
    if (!department) {
      throw new Error('Phòng ban là bắt buộc');
    }

    const membersRef = collection(db, 'members');
    const q = query(
      membersRef,
      where('department', '==', department),
      where('status', '==', 'active'),
      orderBy('fullName', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      cleanMemberData({ id: doc.id, ...doc.data() })
    );

  } catch (error) {
    console.error('Lỗi khi lấy thành viên theo phòng ban:', error);
    throw new Error('Không thể lấy danh sách thành viên: ' + error.message); 
  }
};

/**
 * Lấy danh sách thành viên active
 */
export const layDanhSachActive = async () => {
  try {
    const membersRef = collection(db, 'members');
    const q = query(
      membersRef,
      where('status', '==', 'active'),
      orderBy('fullName', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc =>
      cleanMemberData({ id: doc.id, ...doc.data() })  
    );

  } catch (error) {
    console.error('Lỗi khi lấy thành viên active:', error);
    throw new Error('Không thể lấy danh sách thành viên: ' + error.message);
  }
};

export const thanhVienService = {
  layDanhSach,
  layTheoPhongBan,
  layDanhSachActive
};

export default thanhVienService;