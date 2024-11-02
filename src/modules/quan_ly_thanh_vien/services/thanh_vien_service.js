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
  TRANG_THAI: 'DANG_CONG_TAC'
};

const handleFirebaseError = (error, message) => {
  console.error(`${message}:`, error);
  throw new Error(`${message}: ${error.message}`);
};

const mapThanhVienData = (docSnapshot) => {
  if (!docSnapshot.exists()) return null;

  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    anhDaiDien: data.avatar || '',
    hoTen: data.fullName || '',
    email: data.email || '',
    phongBan: data.department || '',
    chucVu: data.position || DEFAULT_VALUES.CHUC_VU,
    capBac: data.level || DEFAULT_VALUES.CAP_BAC,
    danhSachCapBac: data.levelHistory || [],
    trangThai: data.status || DEFAULT_VALUES.TRANG_THAI,
    soDienThoai: data.phone || '',
    ngayVao: data.joinDate || '',
    memberCode: data.memberCode || '',
    address: data.address || '',
    dateOfBirth: data.dateOfBirth || '',
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
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

const mapThanhVienToFirestore = (data) => {
  const mappedData = {};

  if (data.anhDaiDien !== undefined) mappedData.avatar = data.anhDaiDien;
  if (data.hoTen !== undefined) mappedData.fullName = data.hoTen;
  if (data.email !== undefined) mappedData.email = data.email;
  if (data.phongBan !== undefined) mappedData.department = data.phongBan;
  if (data.chucVu !== undefined) mappedData.position = data.chucVu;
  if (data.capBac !== undefined) mappedData.level = data.capBac;
  if (data.danhSachCapBac !== undefined) mappedData.levelHistory = data.danhSachCapBac;
  if (data.trangThai !== undefined) mappedData.status = data.trangThai;
  if (data.soDienThoai !== undefined) mappedData.phone = data.soDienThoai;
  if (data.ngayVao !== undefined) mappedData.joinDate = data.ngayVao;
  if (data.memberCode !== undefined) mappedData.memberCode = data.memberCode;
  if (data.address !== undefined) mappedData.address = data.address;
  if (data.dateOfBirth !== undefined) mappedData.dateOfBirth = data.dateOfBirth;
  if (data.facebookLink !== undefined) mappedData.facebookLink = data.facebookLink;
  if (data.cvLink !== undefined) mappedData.cvLink = data.cvLink;
  if (data.education !== undefined) mappedData.education = data.education;
  if (data.idNumber !== undefined) mappedData.idNumber = data.idNumber;
  if (data.licensePlate !== undefined) mappedData.licensePlate = data.licensePlate;
  if (data.fatherName !== undefined) mappedData.fatherName = data.fatherName;
  if (data.fatherPhone !== undefined) mappedData.fatherPhone = data.fatherPhone;
  if (data.motherName !== undefined) mappedData.motherName = data.motherName;
  if (data.motherPhone !== undefined) mappedData.motherPhone = data.motherPhone;
  if (data.telegramId !== undefined) mappedData.telegramId = data.telegramId;
  if (data.zaloPhone !== undefined) mappedData.zaloPhone = data.zaloPhone;

  mappedData.updatedAt = serverTimestamp();
  if (data.createdAt) {
    mappedData.createdAt = data.createdAt;
  } else {
    mappedData.createdAt = serverTimestamp();
  }

  return mappedData;
};

export const thanhVienService = {
  layDanhSach: async () => {
    try {
      const membersRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(membersRef);
      return querySnapshot.docs.map(mapThanhVienData).filter(Boolean);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi lấy danh sách thành viên');
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
    }
  },

  capNhatTrangThai: async (id, trangThai) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        status: trangThai,
        updatedAt: serverTimestamp()
      };
      await updateDoc(docRef, updateData);
      return { id, trangThai };
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi cập nhật trạng thái');
    }
  },

  capNhat: async (id, data) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      const updateData = mapThanhVienToFirestore(data);

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      const mappedData = mapThanhVienData(updatedDoc);

      return mappedData;
    } catch (error) {
      console.error('Error updating member:', error);
      handleFirebaseError(error, 'Lỗi khi cập nhật thành viên');
    }
  },

  them: async (data) => {
    try {
      const newData = mapThanhVienToFirestore({
        ...data,
        trangThai: DEFAULT_VALUES.TRANG_THAI,
        chucVu: data.chucVu || DEFAULT_VALUES.CHUC_VU,
        capBac: data.capBac || DEFAULT_VALUES.CAP_BAC,
        danhSachCapBac: data.danhSachCapBac || []
      });

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newData);
      const newDoc = await getDoc(docRef);
      return mapThanhVienData(newDoc);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi thêm thành viên');
    }
  },

  xoa: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi xóa thành viên');
    }
  },

  layTheoPhongBan: async (phongBan) => {
    try {
      const membersRef = collection(db, COLLECTION_NAME);
      const q = query(
        membersRef,
        where('department', '==', phongBan),
        orderBy('fullName')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(mapThanhVienData).filter(Boolean);
    } catch (error) {
      handleFirebaseError(error, 'Lỗi khi lấy thành viên theo phòng ban');
    }
  }
};

export default thanhVienService;
