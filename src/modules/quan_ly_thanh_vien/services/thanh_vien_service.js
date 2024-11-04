// src/modules/quan_ly_thanh_vien/services/thanh_vien_service.js

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

const COLLECTION_NAME = 'members';

const DEFAULT_VALUES = {
  CHUC_VU: 'THANH_VIEN',
  CAP_BAC: 'THU_SINH',
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

const mapThanhVienData = (docSnapshot) => {
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

const mapThanhVienToFirestore = (data) => {
  const mappedData = {
    avatarUrl: data.anhDaiDien || null,
    fullName: data.hoTen || null,
    email: data.email || null,
    department: data.phongBan || null,
    position: data.chucVu || DEFAULT_VALUES.CHUC_VU,
    level: data.capBac || DEFAULT_VALUES.CAP_BAC,
    ngayNhanCapBac: data.ngayNhanCapBac ? new Date(data.ngayNhanCapBac) : null,
    levelHistory: (data.danhSachCapBac || []).map((item) => ({
      capBac: item.capBac || DEFAULT_VALUES.CAP_BAC,
      ngayNhan: item.ngayNhan ? new Date(item.ngayNhan) : null,
      nguoiCapNhat: item.nguoiCapNhat || null,
      anhNguoiCapNhat: item.anhNguoiCapNhat || null,
      ghiChu: item.ghiChu || null,
    })),
    status: data.trangThai || DEFAULT_VALUES.TRANG_THAI,
    phoneNumber: data.soDienThoai || null,
    joinDate: data.ngayVao ? new Date(data.ngayVao) : null,
    memberCode: data.memberCode || null,
    address: data.address || null,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    facebookLink: data.facebookLink || null,
    cvLink: data.cvLink || null,
    education: data.education || null,
    idNumber: data.idNumber || null,
    licensePlate: data.licensePlate || null,
    fatherName: data.fatherName || null,
    fatherPhone: data.fatherPhone || null,
    motherName: data.motherName || null,
    motherPhone: data.motherPhone || null,
    telegramId: data.telegramId || null,
    zaloPhone: data.zaloPhone || null,
    lichSuChinhSua: (data.lichSuChinhSua || []).map((item) => ({
      thoiGian: item.thoiGian ? new Date(item.thoiGian) : serverTimestamp(),
      loai: item.loai || '',
      nguoiThucHien: item.nguoiThucHien || null,
      anhNguoiThucHien: item.anhNguoiThucHien || null,
      thongTinCu: item.thongTinCu || null,
      thongTinMoi: item.thongTinMoi || null,
      ghiChu: item.ghiChu || null,
    })),
    updatedAt: serverTimestamp(),
  };

  if (!data.id) {
    mappedData.createdAt = serverTimestamp();
  }

  return mappedData;
};

export const thanhVienService = {
  layDanhSach: async () => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapThanhVienData).filter(Boolean);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi lấy danh sách thành viên');
      return [];
    }
  },

  layChiTiet: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Không tìm thấy thành viên');
      }

      return mapThanhVienData(docSnap);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi lấy chi tiết thành viên');
      return null;
    }
  },

  capNhatTrangThai: async (id, trangThai) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        status: trangThai,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(docRef, updateData);
      return { id, trangThai };
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi cập nhật trạng thái');
      return null;
    }
  },

  capNhat: async (id, data) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = mapThanhVienToFirestore({ ...data, id });

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      return mapThanhVienData(updatedDoc);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi cập nhật thành viên');
      return null;
    }
  },

  them: async (data) => {
    try {
      const newData = mapThanhVienToFirestore({
        ...data,
        trangThai: DEFAULT_VALUES.TRANG_THAI,
        chucVu: data.chucVu || DEFAULT_VALUES.CHUC_VU,
        capBac: data.capBac || DEFAULT_VALUES.CAP_BAC,
        danhSachCapBac: data.danhSachCapBac || [],
        lichSuChinhSua: data.lichSuChinhSua || [],
      });

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newData);
      const newDoc = await getDoc(docRef);
      return mapThanhVienData(newDoc);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi thêm thành viên');
      return null;
    }
  },

  xoa: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi xóa thành viên');
      return null;
    }
  },

  layTheoPhongBan: async (phongBan) => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('department', '==', phongBan),
        orderBy('fullName')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapThanhVienData).filter(Boolean);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi lấy thành viên theo phòng ban');
      return [];
    }
  },
};

export default thanhVienService;
