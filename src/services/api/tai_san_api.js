// File: src/services/api/tai_san_api.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";

// Clean data before sending to server
const cleanTaiSanData = (taiSanData) => {
  return {
    ma: taiSanData.ma || '',
    ten: taiSanData.ten || '',
    moTa: taiSanData.moTa || '',
    loaiTaiSan: taiSanData.loaiTaiSan || 'thiet_bi',
    nhomTaiSan: taiSanData.nhomTaiSan || 'khac',
    phongBan: taiSanData.phongBan || '',
    giaTriMua: Number(taiSanData.giaTriMua) || 0,
    ngayMua: taiSanData.ngayMua ? Timestamp.fromDate(new Date(taiSanData.ngayMua)) : null,
    hanBaoHanh: taiSanData.hanBaoHanh ? Timestamp.fromDate(new Date(taiSanData.hanBaoHanh)) : null,
    nguoiQuanLy: taiSanData.nguoiQuanLy || '',
    nguoiSuDung: taiSanData.nguoiSuDung || '',
    ghiChu: taiSanData.ghiChu || '',
    anhTaiSan: Array.isArray(taiSanData.anhTaiSan) ? taiSanData.anhTaiSan : [],
    thongSoKyThuat: taiSanData.thongSoKyThuat || {},
    ngayCapNhat: Timestamp.now(),
  };
};

// Get filtered list of tai san
export const getTaiSanList = async ({ startDate, endDate, filters = {}, page = 1, limit = 20 }) => {
  try {
    const taiSanRef = collection(db, "tai_san");
    const conditions = [];

    if (filters.loaiTaiSan) {
      conditions.push(where("loaiTaiSan", "==", filters.loaiTaiSan));
    }

    if (filters.nhomTaiSan) { 
      conditions.push(where("nhomTaiSan", "==", filters.nhomTaiSan));
    }

    if (filters.trangThai) {
      conditions.push(where("trangThai", "==", filters.trangThai));
    }

    if (filters.phongBan) {
      conditions.push(where("phongBan", "==", filters.phongBan));
    }

    if (startDate && endDate) {
      conditions.push(
        where("ngayMua", ">=", Timestamp.fromDate(new Date(startDate))),
        where("ngayMua", "<=", Timestamp.fromDate(new Date(endDate)))
      );
    }

    const baseQuery = conditions.length > 0
      ? query(taiSanRef, ...conditions, orderBy("ngayMua", "desc"))
      : query(taiSanRef, orderBy("ngayMua", "desc"));

    // Get total count
    const totalSnapshot = await getDocs(baseQuery);
    const total = totalSnapshot.size;

    // Add pagination
    let paginatedQuery = baseQuery;
    if (page > 1) {
      const lastDoc = totalSnapshot.docs[(page - 1) * limit - 1];
      paginatedQuery = query(baseQuery, startAfter(lastDoc), limit(limit));
    } else {
      paginatedQuery = query(baseQuery, limit(limit));
    }

    const snapshot = await getDocs(paginatedQuery);
    
    return {
      data: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ngayMua: doc.data().ngayMua?.toDate(),
        hanBaoHanh: doc.data().hanBaoHanh?.toDate(),
        ngayCapNhat: doc.data().ngayCapNhat?.toDate()
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

  } catch (error) {
    console.error('Error getting tai san list:', error);
    throw new Error('Lỗi khi lấy danh sách tài sản: ' + error.message);
  }
};

// Get single tai san
export const getTaiSan = async (id) => {
  try {
    const docRef = doc(db, "tai_san", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Không tìm thấy tài sản');
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      ngayMua: docSnap.data().ngayMua?.toDate(),
      hanBaoHanh: docSnap.data().hanBaoHanh?.toDate(),
      ngayCapNhat: docSnap.data().ngayCapNhat?.toDate()
    };

  } catch (error) {
    console.error('Error getting tai san:', error);
    throw new Error('Lỗi khi lấy thông tin tài sản: ' + error.message);
  }
};

// Create new tai san
export const createTaiSan = async (taiSanData) => {
  try {
    const cleanedData = cleanTaiSanData(taiSanData);
    cleanedData.ngayTao = Timestamp.now();
    cleanedData.trangThai = 'cho_cap_phat';

    const docRef = await addDoc(collection(db, "tai_san"), cleanedData);
    const newDoc = await getDoc(docRef);

    return {
      id: docRef.id,
      ...newDoc.data(),
      ngayMua: newDoc.data().ngayMua?.toDate(),
      hanBaoHanh: newDoc.data().hanBaoHanh?.toDate(),
      ngayTao: newDoc.data().ngayTao?.toDate(),
      ngayCapNhat: newDoc.data().ngayCapNhat?.toDate()
    };

  } catch (error) {
    console.error('Error creating tai san:', error);
    throw new Error('Lỗi khi tạo tài sản: ' + error.message);
  }
};

// Update tai san
export const updateTaiSan = async (id, taiSanData) => {
  try {
    const cleanedData = cleanTaiSanData(taiSanData);
    const docRef = doc(db, "tai_san", id);
    
    await updateDoc(docRef, cleanedData);
    const updatedDoc = await getDoc(docRef);

    return {
      id,
      ...updatedDoc.data(),
      ngayMua: updatedDoc.data().ngayMua?.toDate(), 
      hanBaoHanh: updatedDoc.data().hanBaoHanh?.toDate(),
      ngayTao: updatedDoc.data().ngayTao?.toDate(),
      ngayCapNhat: updatedDoc.data().ngayCapNhat?.toDate()
    };

  } catch (error) {
    console.error('Error updating tai san:', error);
    throw new Error('Lỗi khi cập nhật tài sản: ' + error.message);
  }
};

// Delete tai san
export const deleteTaiSan = async (id) => {
  try {
    await deleteDoc(doc(db, "tai_san", id));
    return true;
  } catch (error) {
    console.error('Error deleting tai san:', error);
    throw new Error('Lỗi khi xóa tài sản: ' + error.message);
  }
};

// Upload images
export const uploadTaiSanImages = async (files) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `tai-san/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Lỗi khi tải lên hình ảnh: ' + error.message);
  }
};

export default {
  getTaiSanList,
  getTaiSan,
  createTaiSan,
  updateTaiSan,
  deleteTaiSan,
  uploadTaiSanImages
};