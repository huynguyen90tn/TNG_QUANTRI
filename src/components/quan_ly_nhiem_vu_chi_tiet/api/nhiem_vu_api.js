// src/components/quan_ly_nhiem_vu_chi_tiet/api/nhiem_vu_api.js
import { db } from '../../../services/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';

// Clean data helper
const cleanData = (data) => {
  if (Array.isArray(data)) {
    return data
      .map((item) => cleanData(item))
      .filter((item) => item !== undefined && item !== null);
  }
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, cleanData(value)])
    );
  }
  return data;
};

// API functions for Tính năng
const getTinhNang = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tinh_nang'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: cleanData(data) };
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách tính năng: ' + error.message);
  }
};

const createTinhNang = async (data) => {
  try {
    const cleanedData = cleanData({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    const docRef = await addDoc(collection(db, 'tinh_nang'), cleanedData);
    return { id: docRef.id, ...cleanedData };
  } catch (error) {
    throw new Error('Lỗi khi tạo tính năng mới: ' + error.message);
  }
};

const updateTinhNang = async (id, data) => {
  try {
    const cleanedData = cleanData({
      ...data,
      updatedAt: Timestamp.now()
    });
    await updateDoc(doc(db, 'tinh_nang', id), cleanedData);
    return { id, ...cleanedData };
  } catch (error) {
    throw new Error('Lỗi khi cập nhật tính năng: ' + error.message);
  }
};

// API functions for Backend
const getBackend = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'backend'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: cleanData(data) };
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách backend: ' + error.message);
  }
};

const createBackend = async (data) => {
  try {
    const cleanedData = cleanData({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    const docRef = await addDoc(collection(db, 'backend'), cleanedData);
    return { id: docRef.id, ...cleanedData };
  } catch (error) {
    throw new Error('Lỗi khi tạo backend mới: ' + error.message);
  }
};

const updateBackend = async (id, data) => {
  try {
    const cleanedData = cleanData({
      ...data,
      updatedAt: Timestamp.now()
    });
    await updateDoc(doc(db, 'backend', id), cleanedData);
    return { id, ...cleanedData };
  } catch (error) {
    throw new Error('Lỗi khi cập nhật backend: ' + error.message);
  }
};

// API functions for Kiểm thử
const getKiemThu = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'kiem_thu'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: cleanData(data) };
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách kiểm thử: ' + error.message);
  }
};

const createKiemThu = async (data) => {
  try {
    const cleanedData = cleanData({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    const docRef = await addDoc(collection(db, 'kiem_thu'), cleanedData);
    return { id: docRef.id, ...cleanedData };
  } catch (error) {
    throw new Error('Lỗi khi tạo kiểm thử mới: ' + error.message);
  }
};

const updateKiemThu = async (id, data) => {
  try {
    const cleanedData = cleanData({
      ...data,
      updatedAt: Timestamp.now()
    });
    await updateDoc(doc(db, 'kiem_thu', id), cleanedData);
    return { id, ...cleanedData };
  } catch (error) {
    throw new Error('Lỗi khi cập nhật kiểm thử: ' + error.message);
  }
};

// API functions for Tổng hợp
const getTongHop = async () => {
  try {
    // Lấy dữ liệu từ cả 3 collection và tổng hợp
    const [tinhNangSnap, backendSnap, kiemThuSnap] = await Promise.all([
      getDocs(collection(db, 'tinh_nang')),
      getDocs(collection(db, 'backend')),
      getDocs(collection(db, 'kiem_thu'))
    ]);

    const tinhNangData = tinhNangSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const backendData = backendSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const kiemThuData = kiemThuSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Tổng hợp dữ liệu
    const tongHopData = tinhNangData.map(tinhNang => {
      const backend = backendData.find(b => b.idTinhNang === tinhNang.id);
      const kiemThu = kiemThuData.filter(k => k.idTinhNang === tinhNang.id);

      return {
        tenTinhNang: tinhNang.title,
        trangThaiCode: tinhNang.trangThai,
        trangThaiBackend: backend?.trangThai || 'Chưa bắt đầu',
        trangThaiKiemThu: kiemThu.length > 0 ? 'Đang kiểm thử' : 'Chưa kiểm thử',
        nguoiPhuTrach: tinhNang.nguoiPhuTrach,
        ngayCapNhat: tinhNang.updatedAt,
        tienDoTongThe: calculateTienDo(tinhNang, backend, kiemThu)
      };
    });

    return { data: cleanData(tongHopData) };
  } catch (error) {
    throw new Error('Lỗi khi lấy dữ liệu tổng hợp: ' + error.message);
  }
};

// Helper function to calculate overall progress
const calculateTienDo = (tinhNang, backend, kiemThu) => {
  let total = 0;
  let count = 0;

  if (tinhNang) {
    total += tinhNang.progress || 0;
    count++;
  }

  if (backend) {
    total += backend.progress || 0;
    count++;
  }

  if (kiemThu && kiemThu.length > 0) {
    const kiemThuProgress = kiemThu.reduce((sum, item) => sum + (item.progress || 0), 0) / kiemThu.length;
    total += kiemThuProgress;
    count++;
  }

  return count > 0 ? Math.round(total / count) : 0;
};

export default {
  getTinhNang,
  createTinhNang,
  updateTinhNang,
  getBackend,
  createBackend,
  updateBackend,
  getKiemThu,
  createKiemThu,
  updateKiemThu,
  getTongHop
};