// File: src/modules/quan_ly_thu_chi/services/thu_chi_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { db } from '../../../services/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'thu_chi';

export const layDanhSachThuChi = async (userId) => {
  try {
    const thuChiRef = collection(db, COLLECTION_NAME);
    const q = query(
      thuChiRef,
      where('nguoiTao', '==', userId),
      orderBy('ngayTao', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      ngayTao: doc.data().ngayTao.toDate()
    }));
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách thu chi: ' + error.message);
  }
};

export const themThuChi = async (data, userId) => {
  try {
    const thuChiRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(thuChiRef, {
      ...data,
      nguoiTao: userId,
      ngayTao: Timestamp.now(),
      ngayCapNhat: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Lỗi khi thêm thu chi: ' + error.message);
  }
};

export const capNhatThuChi = async (id, data) => {
  try {
    const thuChiRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(thuChiRef, {
      ...data,
      ngayCapNhat: Timestamp.now()
    });
    return true;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật thu chi: ' + error.message);
  }
};

export const xoaThuChi = async (id) => {
  try {
    const thuChiRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(thuChiRef);
    return true;
  } catch (error) {
    throw new Error('Lỗi khi xóa thu chi: ' + error.message);
  }
};

export default {
  layDanhSachThuChi,
  themThuChi,
  capNhatThuChi,
  xoaThuChi
};