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
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { CAP_BAC } from '../constants/trang_thai_thanh_vien';

const COLLECTION_NAME = 'members';

const DEFAULT_VALUES = {
  CHUC_VU: 'THANH_VIEN',
  CAP_BAC: CAP_BAC.THU_SINH,
  TRANG_THAI: 'DANG_CONG_TAC',
};

const handleFirebaseError = (error, message) => {
  console.error(`${message}:`, error);
  throw new Error(`${message}: ${error.message}`);
};

const convertTimestampToDate = (timestamp) => {
  if (!timestamp) return null;

  if (timestamp?.toDate) {
    return timestamp.toDate();
  }

  if (timestamp instanceof Date) {
    return timestamp;
  }

  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};

const cleanMemberData = (docSnapshot) => {
  if (!docSnapshot.exists()) return null;

  const data = docSnapshot.data();

  const createdAt = convertTimestampToDate(data.createdAt);
  const updatedAt = convertTimestampToDate(data.updatedAt);
  const dateOfBirth = convertTimestampToDate(data.dateOfBirth);
  const ngayVao = convertTimestampToDate(data.joinDate);
  const ngayNhanCapBac = convertTimestampToDate(data.ngayNhanCapBac);

  const danhSachCapBac = (data.levelHistory || []).map((item) => ({
    capBac: item.capBac || DEFAULT_VALUES.CAP_BAC,
    ngayNhan: convertTimestampToDate(item.ngayNhan),
    nguoiCapNhat: item.nguoiCapNhat || '',
    anhNguoiCapNhat: item.anhNguoiCapNhat || '',
    ghiChu: item.ghiChu || '',
  }));

  const lichSuChinhSua = (data.lichSuChinhSua || []).map((item) => ({
    thoiGian: convertTimestampToDate(item.thoiGian),
    loai: item.loai || '',
    nguoiThucHien: item.nguoiThucHien || '',
    anhNguoiThucHien: item.anhNguoiThucHien || '',
    thongTinCu: item.thongTinCu || '',
    thongTinMoi: item.thongTinMoi || '',
    ghiChu: item.ghiChu || '',
  }));

  return {
    id: docSnapshot.id,
    anhDaiDien: data.avatarUrl || '',
    hoTen: data.fullName || '',
    email: data.email || '',
    phongBan: data.department || '',
    chucVu: data.position || DEFAULT_VALUES.CHUC_VU,
    capBac: data.level || DEFAULT_VALUES.CAP_BAC,
    ngayNhanCapBac: ngayNhanCapBac || null,
    danhSachCapBac,
    trangThai: data.status || DEFAULT_VALUES.TRANG_THAI,
    soDienThoai: data.phoneNumber || '',
    ngayVao: ngayVao || null,
    memberCode: data.memberCode || '',
    address: data.address || '',
    dateOfBirth: dateOfBirth || null,
    facebookLink: data.facebookLink || '',
    cvLink: data.cvLink || '',
    education: data.education || '',
    idNumber: data.idNumber || '',
    licensePlate: data.licensePlate || '',
    fatherName: data.fatherName || '',
    fatherPhone: data.fatherPhone || '',
    motherName: data.motherName || '',
    motherPhone: data.motherPhone || '', 
    telegramId: data.telegramId || '',
    zaloPhone: data.zaloPhone || '',
    lichSuChinhSua,
    createdAt,
    updatedAt,
  };
};

const layDanhSach = async (filters = {}) => {
  try {
    const membersRef = collection(db, COLLECTION_NAME);
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

    const q = conditions.length > 0
      ? query(membersRef, ...conditions, orderBy('fullName', 'asc'))
      : query(membersRef, orderBy('fullName', 'asc'));

    const querySnapshot = await getDocs(q);
    const members = querySnapshot.docs.map(doc => cleanMemberData(doc)).filter(Boolean);

    return members;
  } catch (error) {
    handleFirebaseError(error, 'Lỗi khi lấy danh sách thành viên');
  }
};

const layTheoPhongBan = async (phongBan) => {
  try {
    if (!phongBan) {
      throw new Error('Phòng ban là bắt buộc');
    }

    const membersRef = collection(db, COLLECTION_NAME);
    const q = query(
      membersRef,
      where('department', '==', phongBan),
      where('status', '==', 'active'),
      orderBy('fullName', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => cleanMemberData(doc)).filter(Boolean);
  } catch (error) {
    handleFirebaseError(error, 'Lỗi khi lấy thành viên theo phòng ban');
  }
};

const layDanhSachActive = async () => {
  try {
    const membersRef = collection(db, COLLECTION_NAME);
    const q = query(
      membersRef,
      where('status', '==', 'active'),
      orderBy('fullName', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => cleanMemberData(doc)).filter(Boolean);
  } catch (error) {
    handleFirebaseError(error, 'Lỗi khi lấy thành viên active');
  }
};

export const thanhVienService = {
  layDanhSach,
  layTheoPhongBan,
  layDanhSachActive,
};

export default thanhVienService;