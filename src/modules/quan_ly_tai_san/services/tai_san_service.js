// File: src/modules/quan_ly_tai_san/services/tai_san_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Link tham khảo: https://firebase.google.com/docs/reference/js/firestore_
// Nhánh: main

import { db } from '../../../services/firebase';
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
  startAfter,
  runTransaction,
  getDoc,
} from 'firebase/firestore';

const COLLECTION = {
  TAI_SAN: 'tai_san',
  BAO_TRI: 'tai_san_bao_tri',
  KIEM_KE: 'tai_san_kiem_ke',
  CAP_PHAT: 'tai_san_cap_phat',
};

const ITEMS_PER_PAGE = 20;

const cleanTaiSanData = (data, id = null) => {
  const cleanedData = {
    ma: data.ma || '',
    ten: data.ten || '',
    moTa: data.moTa || '',
    loaiTaiSan: data.loaiTaiSan || 'thiet_bi',
    nhomTaiSan: data.nhomTaiSan || 'khac',
    trangThai: data.trangThai || 'cho_cap_phat',
    phongBan: data.phongBan || '',
    giaTriMua: data.giaTriMua || 0,
    ngayMua: data.ngayMua ? Timestamp.fromDate(new Date(data.ngayMua)) : Timestamp.now(),
    hanBaoHanh: data.hanBaoHanh ? Timestamp.fromDate(new Date(data.hanBaoHanh)) : null,
    nguoiQuanLy: data.nguoiQuanLy || '',
    nguoiSuDung: data.nguoiSuDung || '',
    ghiChu: data.ghiChu || '',
    anhTaiSan: Array.isArray(data.anhTaiSan) ? data.anhTaiSan : [],
    thongSoKyThuat: data.thongSoKyThuat || {},
    ngayCapNhat: Timestamp.now(),
  };

  if (!id) {
    cleanedData.ngayTao = Timestamp.now();
    cleanedData.nguoiTao = data.nguoiTao || '';
  }

  return cleanedData;
};

/**
 * Lấy danh sách tài sản có phân trang và filter
 */
export const layDanhSachTaiSan = async (filters = {}, page = 1) => {
  try {
    const taiSanRef = collection(db, COLLECTION.TAI_SAN);
    let conditions = [];

    if (filters.loaiTaiSan) {
      conditions.push(where('loaiTaiSan', '==', filters.loaiTaiSan));
    }
    if (filters.nhomTaiSan) {
      conditions.push(where('nhomTaiSan', '==', filters.nhomTaiSan));
    }
    if (filters.trangThai) {
      conditions.push(where('trangThai', '==', filters.trangThai));
    }
    if (filters.phongBan) {
      conditions.push(where('phongBan', '==', filters.phongBan));
    }
    if (filters.nguoiQuanLy) {
      conditions.push(where('nguoiQuanLy', '==', filters.nguoiQuanLy));
    }
    if (filters.nguoiSuDung) {
      conditions.push(where('nguoiSuDung', '==', filters.nguoiSuDung));
    }
    if (filters.tuNgay && filters.denNgay) {
      const tuNgay = Timestamp.fromDate(new Date(filters.tuNgay));
      const denNgay = Timestamp.fromDate(new Date(filters.denNgay));
      conditions.push(where('ngayMua', '>=', tuNgay));
      conditions.push(where('ngayMua', '<=', denNgay));
    }

    let q =
      conditions.length > 0
        ? query(taiSanRef, ...conditions, orderBy('ngayTao', 'desc'))
        : query(taiSanRef, orderBy('ngayTao', 'desc'));

    if (page > 1) {
      const lastDoc = await getDocs(query(q, limit((page - 1) * ITEMS_PER_PAGE)));
      const lastVisible = lastDoc.docs[lastDoc.docs.length - 1];
      q = query(q, startAfter(lastVisible), limit(ITEMS_PER_PAGE));
    } else {
      q = query(q, limit(ITEMS_PER_PAGE));
    }

    const snapshot = await getDocs(q);
    const totalSnapshot = await getDocs(query(taiSanRef, ...conditions));

    const taiSan = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      ngayTao: doc.data().ngayTao?.toDate(),
      ngayCapNhat: doc.data().ngayCapNhat?.toDate(),
      ngayMua: doc.data().ngayMua?.toDate(),
      hanBaoHanh: doc.data().hanBaoHanh?.toDate(),
    }));

    return {
      data: taiSan,
      page,
      limit: ITEMS_PER_PAGE,
      totalItems: totalSnapshot.size,
      totalPages: Math.ceil(totalSnapshot.size / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài sản:', error);
    throw new Error(`Lỗi khi lấy danh sách tài sản: ${error.message}`);
  }
};

/**
 * Lấy chi tiết tài sản
 */
export const layChiTietTaiSan = async (id) => {
  try {
    if (!id) throw new Error('ID tài sản là bắt buộc');

    const taiSanRef = doc(db, COLLECTION.TAI_SAN, id);
    const taiSanDoc = await getDoc(taiSanRef);

    if (!taiSanDoc.exists()) {
      throw new Error('Không tìm thấy thông tin tài sản');
    }

    const data = taiSanDoc.data();
    return {
      id: taiSanDoc.id,
      ...data,
      ngayTao: data.ngayTao?.toDate(),
      ngayCapNhat: data.ngayCapNhat?.toDate(),
      ngayMua: data.ngayMua?.toDate(),
      hanBaoHanh: data.hanBaoHanh?.toDate(),
    };
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tài sản:', error);
    throw new Error(`Lỗi khi lấy chi tiết tài sản: ${error.message}`);
  }
};

/**
 * Thêm tài sản mới
 */
export const themTaiSan = async (data) => {
  try {
    if (!data.ma || !data.ten || !data.loaiTaiSan || !data.phongBan) {
      throw new Error('Thiếu thông tin bắt buộc');
    }

    const kiemTraMa = await getDocs(
      query(collection(db, COLLECTION.TAI_SAN), where('ma', '==', data.ma))
    );
    if (!kiemTraMa.empty) {
      throw new Error('Mã tài sản đã tồn tại');
    }

    const cleanedData = cleanTaiSanData(data);
    const docRef = await addDoc(collection(db, COLLECTION.TAI_SAN), cleanedData);

    return {
      id: docRef.id,
      ...cleanedData,
      ngayTao: cleanedData.ngayTao.toDate(),
      ngayCapNhat: cleanedData.ngayCapNhat.toDate(),
      ngayMua: cleanedData.ngayMua.toDate(),
      hanBaoHanh: cleanedData.hanBaoHanh?.toDate(),
    };
  } catch (error) {
    console.error('Lỗi khi thêm tài sản:', error);
    throw new Error(`Lỗi khi thêm tài sản: ${error.message}`);
  }
};

/**
 * Cập nhật tài sản
 */
export const capNhatTaiSan = async (id, data) => {
  try {
    if (!id) throw new Error('ID tài sản là bắt buộc');

    const taiSanRef = doc(db, COLLECTION.TAI_SAN, id);
    const taiSanDoc = await getDoc(taiSanRef);

    if (!taiSanDoc.exists()) {
      throw new Error('Không tìm thấy thông tin tài sản');
    }

    const cleanedData = cleanTaiSanData(data, id);

    if (data.ma) {
      const kiemTraMa = await getDocs(
        query(collection(db, COLLECTION.TAI_SAN), where('ma', '==', data.ma))
      );
      const docWithMa = kiemTraMa.docs.find((doc) => doc.id !== id);
      if (docWithMa) {
        throw new Error('Mã tài sản đã tồn tại');
      }
    }

    await updateDoc(taiSanRef, cleanedData);

    return {
      id,
      ...cleanedData,
      ngayTao: taiSanDoc.data().ngayTao?.toDate(),
      ngayCapNhat: cleanedData.ngayCapNhat.toDate(),
      ngayMua: cleanedData.ngayMua.toDate(),
      hanBaoHanh: cleanedData.hanBaoHanh?.toDate(),
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật tài sản:', error);
    throw new Error(`Lỗi khi cập nhật tài sản: ${error.message}`);
  }
};

/**
 * Xóa tài sản
 */
export const xoaTaiSan = async (id) => {
  try {
    if (!id) throw new Error('ID tài sản là bắt buộc');

    const taiSanRef = doc(db, COLLECTION.TAI_SAN, id);
    const taiSanDoc = await getDoc(taiSanRef);

    if (!taiSanDoc.exists()) {
      throw new Error('Không tìm thấy thông tin tài sản');
    }
    if (taiSanDoc.data().trangThai === 'da_cap_phat') {
      throw new Error('Không thể xóa tài sản đang được cấp phát');
    }

    await deleteDoc(taiSanRef);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa tài sản:', error);
    throw new Error(`Lỗi khi xóa tài sản: ${error.message}`);
  }
};

/**
 * Cấp phát tài sản
 */
export const capPhatTaiSan = async (taiSanId, data) => {
  try {
    if (!taiSanId || !data.nguoiSuDung) {
      throw new Error('Thiếu thông tin bắt buộc');
    }

    const taiSanRef = doc(db, COLLECTION.TAI_SAN, taiSanId);

    return await runTransaction(db, async (transaction) => {
      const taiSanDoc = await transaction.get(taiSanRef);

      if (!taiSanDoc.exists()) {
        throw new Error('Không tìm thấy thông tin tài sản');
      }

      const taiSanData = taiSanDoc.data();
      if (taiSanData.trangThai !== 'cho_cap_phat') {
        throw new Error('Tài sản không trong trạng thái chờ cấp phát');
      }

      const updateData = {
        trangThai: 'da_cap_phat',
        nguoiSuDung: data.nguoiSuDung,
        ngayCapNhat: Timestamp.now(),
      };

      const capPhatData = {
        taiSanId,
        nguoiSuDung: data.nguoiSuDung,
        ngayCapPhat: Timestamp.now(),
        nguoiCapPhat: data.nguoiCapPhat,
        ghiChu: data.ghiChu || '',
        trangThai: 'da_cap_phat',
        ngayTao: Timestamp.now(),
        ngayCapNhat: Timestamp.now(),
      };

      transaction.update(taiSanRef, updateData);
      await addDoc(collection(db, COLLECTION.CAP_PHAT), capPhatData);

      return {
        ...taiSanData,
        ...updateData,
        id: taiSanId,
      };
    });
  } catch (error) {
    console.error('Lỗi khi cấp phát tài sản:', error);
    throw new Error(`Lỗi khi cấp phát tài sản: ${error.message}`);
  }
};

/**
 * Thu hồi tài sản
 */
export const thuHoiTaiSan = async (taiSanId, data) => {
  try {
    if (!taiSanId) throw new Error('ID tài sản là bắt buộc');

    const taiSanRef = doc(db, COLLECTION.TAI_SAN, taiSanId);

    return await runTransaction(db, async (transaction) => {
      const taiSanDoc = await transaction.get(taiSanRef);

      if (!taiSanDoc.exists()) {
        throw new Error('Không tìm thấy thông tin tài sản');
      }

      const taiSanData = taiSanDoc.data();
      if (taiSanData.trangThai !== 'da_cap_phat') {
        throw new Error('Tài sản không trong trạng thái đã cấp phát');
      }

      const updateData = {
        trangThai: 'da_thu_hoi',
        nguoiSuDung: null,
        ngayCapNhat: Timestamp.now(),
      };

      const thuHoiData = {
        taiSanId,
        ngayThuHoi: Timestamp.now(),
        nguoiThuHoi: data.nguoiThuHoi,
        lyDo: data.lyDo || '',
        ghiChu: data.ghiChu || '',
        trangThai: 'da_thu_hoi',
        ngayCapNhat: Timestamp.now(),
      };

      const capPhatQuery = query(
        collection(db, COLLECTION.CAP_PHAT),
        where('taiSanId', '==', taiSanId),
        where('trangThai', '==', 'da_cap_phat'),
        limit(1)
      );

      const capPhatDocs = await getDocs(capPhatQuery);
      if (!capPhatDocs.empty) {
        const capPhatRef = doc(db, COLLECTION.CAP_PHAT, capPhatDocs.docs[0].id);
        transaction.update(capPhatRef, thuHoiData);
      }

      transaction.update(taiSanRef, updateData);

      return {
        ...taiSanData,
        ...updateData,
        id: taiSanId,
      };
    });
  } catch (error) {
    console.error('Lỗi khi thu hồi tài sản:', error);
    throw new Error(`Lỗi khi thu hồi tài sản: ${error.message}`);
  }
};

/**
 * Tạo bảo trì tài sản
 */
export const taoBaoTriTaiSan = async (taiSanId, data) => {
  try {
    if (!taiSanId || !data.noiDung || !data.nguoiThucHien) {
      throw new Error('Thiếu thông tin bắt buộc');
    }

    const taiSanRef = doc(db, COLLECTION.TAI_SAN, taiSanId);

    return await runTransaction(db, async (transaction) => {
      const taiSanDoc = await transaction.get(taiSanRef);

      if (!taiSanDoc.exists()) {
        throw new Error('Không tìm thấy thông tin tài sản');
      }

      const updateTaiSan = {
        trangThai: 'dang_bao_tri',
        ngayCapNhat: Timestamp.now(),
      };

      const baoTriData = {
        taiSanId,
        ngayBatDau: Timestamp.fromDate(new Date(data.ngayBatDau)),
        ngayKetThuc: data.ngayKetThuc ? Timestamp.fromDate(new Date(data.ngayKetThuc)) : null,
        noiDung: data.noiDung,
        chiPhi: data.chiPhi || 0,
        nguoiThucHien: data.nguoiThucHien,
        ghiChu: data.ghiChu || '',
        trangThai: 'dang_thuc_hien',
        anhBaoTri: data.anhBaoTri || [],
        ngayTao: Timestamp.now(),
        ngayCapNhat: Timestamp.now(),
        nguoiTao: data.nguoiTao || '',
        nguoiCapNhat: data.nguoiTao || '',
      };

      const baoTriRef = await addDoc(collection(db, COLLECTION.BAO_TRI), baoTriData);
      transaction.update(taiSanRef, updateTaiSan);

      return {
        id: baoTriRef.id,
        ...baoTriData,
        ngayBatDau: baoTriData.ngayBatDau.toDate(),
        ngayKetThuc: baoTriData.ngayKetThuc?.toDate(),
        ngayTao: baoTriData.ngayTao.toDate(),
        ngayCapNhat: baoTriData.ngayCapNhat.toDate(),
      };
    });
  } catch (error) {
    console.error('Lỗi khi tạo bảo trì tài sản:', error);
    throw new Error(`Lỗi khi tạo bảo trì tài sản: ${error.message}`);
  }
};

/**
 * Hoàn thành bảo trì tài sản
 */
export const hoanThanhBaoTri = async (baoTriId, data) => {
  try {
    if (!baoTriId) throw new Error('ID bảo trì là bắt buộc');

    const baoTriRef = doc(db, COLLECTION.BAO_TRI, baoTriId);

    return await runTransaction(db, async (transaction) => {
      const baoTriDoc = await transaction.get(baoTriRef);

      if (!baoTriDoc.exists()) {
        throw new Error('Không tìm thấy thông tin bảo trì');
      }

      const baoTriData = baoTriDoc.data();
      if (baoTriData.trangThai !== 'dang_thuc_hien') {
        throw new Error('Bảo trì không trong trạng thái đang thực hiện');
      }

      const taiSanRef = doc(db, COLLECTION.TAI_SAN, baoTriData.taiSanId);
      const taiSanDoc = await transaction.get(taiSanRef);

      if (!taiSanDoc.exists()) {
        throw new Error('Không tìm thấy thông tin tài sản');
      }

      const updateBaoTri = {
        trangThai: 'da_hoan_thanh',
        ngayKetThuc: Timestamp.now(),
        ketQua: data.ketQua || '',
        ghiChu: data.ghiChu || '',
        ngayCapNhat: Timestamp.now(),
        nguoiCapNhat: data.nguoiCapNhat,
      };

      const updateTaiSan = {
        trangThai: data.trangThaiTaiSan || 'cho_cap_phat',
        ngayCapNhat: Timestamp.now(),
      };

      transaction.update(baoTriRef, updateBaoTri);
      transaction.update(taiSanRef, updateTaiSan);

      return {
        id: baoTriId,
        ...baoTriData,
        ...updateBaoTri,
        ngayBatDau: baoTriData.ngayBatDau.toDate(),
        ngayKetThuc: updateBaoTri.ngayKetThuc.toDate(),
        ngayTao: baoTriData.ngayTao.toDate(),
        ngayCapNhat: updateBaoTri.ngayCapNhat.toDate(),
      };
    });
  } catch (error) {
    console.error('Lỗi khi hoàn thành bảo trì:', error);
    throw new Error(`Lỗi khi hoàn thành bảo trì: ${error.message}`);
  }
};

/**
 * Tạo kiểm kê tài sản
 */
export const taoKiemKeTaiSan = async (taiSanId, data) => {
  try {
    if (!taiSanId || !data.nguoiKiemKe || !data.tinhTrang) {
      throw new Error('Thiếu thông tin bắt buộc');
    }

    const taiSanRef = doc(db, COLLECTION.TAI_SAN, taiSanId);
    const taiSanDoc = await getDoc(taiSanRef);

    if (!taiSanDoc.exists()) {
      throw new Error('Không tìm thấy thông tin tài sản');
    }

    const kiemKeData = {
      taiSanId,
      ngayKiemKe: Timestamp.fromDate(new Date(data.ngayKiemKe || Date.now())),
      nguoiKiemKe: data.nguoiKiemKe,
      tinhTrang: data.tinhTrang,
      ghiChu: data.ghiChu || '',
      anhKiemKe: data.anhKiemKe || [],
      ketQua: data.ketQua || 'binh_thuong',
      ngayTao: Timestamp.now(),
      ngayCapNhat: Timestamp.now(),
      nguoiTao: data.nguoiTao || '',
      nguoiCapNhat: data.nguoiTao || '',
    };

    const kiemKeRef = await addDoc(collection(db, COLLECTION.KIEM_KE), kiemKeData);

    if (data.ketQua === 'hu_hong' || data.ketQua === 'mat') {
      await updateDoc(taiSanRef, {
        trangThai: data.ketQua === 'hu_hong' ? 'hong' : 'mat',
        ngayCapNhat: Timestamp.now(),
      });
    }

    return {
      id: kiemKeRef.id,
      ...kiemKeData,
      ngayKiemKe: kiemKeData.ngayKiemKe.toDate(),
      ngayTao: kiemKeData.ngayTao.toDate(),
      ngayCapNhat: kiemKeData.ngayCapNhat.toDate(),
    };
  } catch (error) {
    console.error('Lỗi khi tạo kiểm kê tài sản:', error);
    throw new Error(`Lỗi khi tạo kiểm kê tài sản: ${error.message}`);
  }
};

/**
 * Lấy lịch sử bảo trì của tài sản
 */
export const layLichSuBaoTri = async (taiSanId) => {
  try {
    if (!taiSanId) throw new Error('ID tài sản là bắt buộc');

    const q = query(
      collection(db, COLLECTION.BAO_TRI),
      where('taiSanId', '==', taiSanId),
      orderBy('ngayTao', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      ngayBatDau: doc.data().ngayBatDau?.toDate(),
      ngayKetThuc: doc.data().ngayKetThuc?.toDate(),
      ngayTao: doc.data().ngayTao?.toDate(),
      ngayCapNhat: doc.data().ngayCapNhat?.toDate(),
    }));
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử bảo trì:', error);
    throw new Error(`Lỗi khi lấy lịch sử bảo trì: ${error.message}`);
  }
};

/**
 * Lấy lịch sử kiểm kê của tài sản
 */
export const layLichSuKiemKe = async (taiSanId) => {
  try {
    if (!taiSanId) throw new Error('ID tài sản là bắt buộc');

    const q = query(
      collection(db, COLLECTION.KIEM_KE),
      where('taiSanId', '==', taiSanId),
      orderBy('ngayKiemKe', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      ngayKiemKe: doc.data().ngayKiemKe?.toDate(),
      ngayTao: doc.data().ngayTao?.toDate(),
      ngayCapNhat: doc.data().ngayCapNhat?.toDate(),
    }));
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử kiểm kê:', error);
    throw new Error(`Lỗi khi lấy lịch sử kiểm kê: ${error.message}`);
  }
};

export default {
  layDanhSachTaiSan,
  layChiTietTaiSan,
  themTaiSan,
  capNhatTaiSan,
  xoaTaiSan,
  capPhatTaiSan,
  thuHoiTaiSan,
  taoBaoTriTaiSan,
  hoanThanhBaoTri,
  taoKiemKeTaiSan,
  layLichSuBaoTri,
  layLichSuKiemKe,
};
