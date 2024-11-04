// File: src/modules/nhiem_vu_hang_ngay/services/nhiem_vu_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Link tham khảo: https://firebase.google.com/docs/reference/js/firestore_

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
  arrayUnion,
  arrayRemove,
  getDoc,
  runTransaction
} from 'firebase/firestore';

const COLLECTION_NAME = 'nhiem_vu_hang_ngay';
const COOLDOWN_TIME = 120000; // 2 phút cooldown
const VERIFICATION_TIME = 60000; // 1 phút kiểm tra

const getDefaultDateRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);
  return { startDate: today, endDate: tomorrow };
};

const normalizeTimestamp = (timestamp) => {
  if (!timestamp) {
    const { startDate } = getDefaultDateRange();
    return Timestamp.fromDate(startDate);
  }

  try {
    if (timestamp instanceof Date) {
      return Timestamp.fromDate(timestamp);
    }
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) throw new Error('Invalid date string');
      return Timestamp.fromDate(date);
    }
    if (timestamp instanceof Timestamp) {
      return timestamp;
    }
    throw new Error('Invalid timestamp format');
  } catch (error) {
    console.error('Lỗi chuyển đổi timestamp:', error);
    const { startDate } = getDefaultDateRange();
    return Timestamp.fromDate(startDate);
  }
};

const safeDateConversion = (timestamp) => {
  try {
    if (!timestamp) return null;
    if (timestamp instanceof Timestamp) return timestamp.toDate();
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string') return new Date(timestamp);
    return null;
  } catch (error) {
    console.error('Lỗi chuyển đổi ngày:', error);
    return null;
  }
};

export const taoNhiemVu = async (nhiemVuData) => {
  try {
    const normalizedData = {
      ...nhiemVuData,
      tieuDe: nhiemVuData.tieuDe || '',
      moTa: nhiemVuData.moTa || '',
      loaiNhiemVu: nhiemVuData.loaiNhiemVu || 'like',
      duongDan: nhiemVuData.duongDan || '',
      ngayTao: Timestamp.now(),
      ngayCapNhat: Timestamp.now(),
      trangThai: 'chua_hoan_thanh',
      danhSachHoanThanh: [],
      danhSachDangKiemTra: [],
      nguoiTao: nhiemVuData.nguoiTao || null,
      phongBan: Array.isArray(nhiemVuData.phongBan) 
        ? nhiemVuData.phongBan.filter(dept => [
            'thien-minh-duong', 
            'tay-van-cac', 
            'hoa-tam-duong',
            'ho-ly-son-trang', 
            'hoa-van-cac', 
            'tinh-van-cac'
          ].includes(dept))
        : []
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), normalizedData);

    return {
      id: docRef.id,
      ...normalizedData,
      ngayTao: normalizedData.ngayTao.toDate(),
      ngayCapNhat: normalizedData.ngayCapNhat.toDate()
    };
  } catch (error) {
    console.error('Chi tiết lỗi tạo nhiệm vụ:', error);
    throw new Error(`Lỗi khi tạo nhiệm vụ: ${error.message}`);
  }
};

export const layDanhSachNhiemVu = async (startDate, endDate) => {
  try {
    let start = startDate;
    let end = endDate;

    if (!startDate || !endDate) {
      const defaultRange = getDefaultDateRange();
      start = defaultRange.startDate;
      end = defaultRange.endDate;
    }

    const startTimestamp = normalizeTimestamp(start);
    const endTimestamp = normalizeTimestamp(end);

    const nhiemVuRef = collection(db, COLLECTION_NAME);
    const q = query(
      nhiemVuRef,
      where('ngayTao', '>=', startTimestamp),
      where('ngayTao', '<=', endTimestamp),
      orderBy('ngayTao', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        ngayTao: safeDateConversion(data.ngayTao) || new Date(),
        ngayCapNhat: safeDateConversion(data.ngayCapNhat) || new Date(),
        danhSachHoanThanh: data.danhSachHoanThanh?.map(item => ({
          ...item,
          thoiGian: safeDateConversion(item.thoiGian) || new Date()
        })) || [],
        danhSachDangKiemTra: data.danhSachDangKiemTra?.map(item => ({
          ...item,
          thoiGianBatDau: safeDateConversion(item.thoiGianBatDau) || new Date(),
          thoiGianKetThuc: safeDateConversion(item.thoiGianKetThuc) || new Date(Date.now() + VERIFICATION_TIME)
        })) || []
      };
    });
  } catch (error) {
    console.error('Chi tiết lỗi lấy danh sách:', error);
    throw new Error(`Lỗi khi lấy danh sách nhiệm vụ: ${error.message}`);
  }
};

export const batDauKiemTra = async (nhiemVuId, userId) => {
  try {
    if (!nhiemVuId || !userId) {
      throw new Error('ID nhiệm vụ và người dùng là bắt buộc');
    }

    const nhiemVuRef = doc(db, COLLECTION_NAME, nhiemVuId);
    
    return await runTransaction(db, async (transaction) => {
      const nhiemVuDoc = await transaction.get(nhiemVuRef);
      
      if (!nhiemVuDoc.exists()) {
        throw new Error('Không tìm thấy nhiệm vụ');
      }

      const nhiemVuData = nhiemVuDoc.data();

      // Kiểm tra cooldown
      const lastCompletion = nhiemVuData.danhSachHoanThanh?.find(
        completion => completion.userId === userId
      );

      if (lastCompletion?.thoiGian) {
        const lastCompletionDate = safeDateConversion(lastCompletion.thoiGian);
        if (lastCompletionDate) {
          const timeSinceLastCompletion = Date.now() - lastCompletionDate.getTime();
          if (timeSinceLastCompletion < COOLDOWN_TIME) {
            const remainingCooldown = Math.ceil((COOLDOWN_TIME - timeSinceLastCompletion) / 1000);
            throw new Error(`Vui lòng đợi ${remainingCooldown} giây trước khi thực hiện nhiệm vụ tiếp theo`);
          }
        }
      }

      // Kiểm tra đang kiểm tra
      const isVerifying = nhiemVuData.danhSachDangKiemTra?.some(
        item => item.userId === userId && 
        safeDateConversion(item.thoiGianKetThuc)?.getTime() > Date.now()
      );

      if (isVerifying) {
        throw new Error('Bạn đang trong quá trình kiểm tra nhiệm vụ này');
      }

      const kiemTraData = {
        userId,
        thoiGianBatDau: Timestamp.now(),
        thoiGianKetThuc: Timestamp.fromMillis(Date.now() + VERIFICATION_TIME)
      };

      transaction.update(nhiemVuRef, {
        danhSachDangKiemTra: arrayUnion(kiemTraData),
        ngayCapNhat: Timestamp.now()
      });

      return {
        batDau: Date.now(),
        ketThuc: Date.now() + VERIFICATION_TIME
      };
    });
  } catch (error) {
    console.error('Chi tiết lỗi bắt đầu kiểm tra:', error);
    throw new Error(`Lỗi khi bắt đầu kiểm tra: ${error.message}`);
  }
};

export const hoanThanhKiemTra = async (nhiemVuId, userId, ketQua = true) => {
  try {
    if (!nhiemVuId || !userId) {
      throw new Error('ID nhiệm vụ và người dùng là bắt buộc');
    }

    const nhiemVuRef = doc(db, COLLECTION_NAME, nhiemVuId);
    
    return await runTransaction(db, async (transaction) => {
      const nhiemVuDoc = await transaction.get(nhiemVuRef);
      
      if (!nhiemVuDoc.exists()) {
        throw new Error('Không tìm thấy nhiệm vụ');
      }

      const nhiemVuData = nhiemVuDoc.data();

      // Kiểm tra đang kiểm tra
      const dangKiemTra = nhiemVuData.danhSachDangKiemTra?.find(
        item => item.userId === userId
      );

      if (!dangKiemTra) {
        throw new Error('Không tìm thấy thông tin kiểm tra');
      }

      const updateData = {
        danhSachDangKiemTra: arrayRemove(dangKiemTra),
        ngayCapNhat: Timestamp.now()
      };

      if (ketQua) {
        updateData.danhSachHoanThanh = arrayUnion({
          userId,
          thoiGian: Timestamp.now(),
          ketQua
        });
      }

      transaction.update(nhiemVuRef, updateData);
      return true;
    });
  } catch (error) {
    console.error('Chi tiết lỗi hoàn thành kiểm tra:', error);
    throw new Error(`Lỗi khi hoàn thành kiểm tra: ${error.message}`);
  }
};

export const xoaNhiemVu = async (nhiemVuId) => {
  try {
    if (!nhiemVuId) {
      throw new Error('ID nhiệm vụ là bắt buộc');
    }

    await deleteDoc(doc(db, COLLECTION_NAME, nhiemVuId));
    return true;
  } catch (error) {
    console.error('Chi tiết lỗi xóa nhiệm vụ:', error);
    throw new Error(`Lỗi khi xóa nhiệm vụ: ${error.message}`);
  }
};

export const layThongKeNhiemVu = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      const defaultRange = getDefaultDateRange();
      startDate = defaultRange.startDate;
      endDate = defaultRange.endDate;
    }

    const nhiemVuList = await layDanhSachNhiemVu(startDate, endDate);
    
    const thongKe = {
      tongSoNhiemVu: nhiemVuList.length,
      daHoanThanh: 0,
      dangThucHien: 0,
      dangKiemTra: 0,
      danhSachThanhVien: new Map()
    };

    nhiemVuList.forEach(nhiemVu => {
      const soNguoiHoanThanh = nhiemVu.danhSachHoanThanh?.length || 0;
      const soNguoiDangKiemTra = nhiemVu.danhSachDangKiemTra?.length || 0;
      
      if (soNguoiHoanThanh > 0) {
        thongKe.daHoanThanh++;
        nhiemVu.danhSachHoanThanh.forEach(completion => {
          const thongKeUser = thongKe.danhSachThanhVien.get(completion.userId) || { 
            daHoanThanh: 0,
            tongNhiemVu: thongKe.tongSoNhiemVu
          };
          thongKeUser.daHoanThanh++;
          thongKe.danhSachThanhVien.set(completion.userId, thongKeUser);
        });
      } else {
        thongKe.dangThucHien++;
      }
      
      thongKe.dangKiemTra += soNguoiDangKiemTra;
    });

    return thongKe;
  } catch (error) {
    console.error('Chi tiết lỗi lấy thống kê:', error);
    throw new Error(`Lỗi khi lấy thống kê nhiệm vụ: ${error.message}`);
  }
};

export default {
  taoNhiemVu,
  layDanhSachNhiemVu,
  batDauKiemTra,
  hoanThanhKiemTra,
  xoaNhiemVu,
  layThongKeNhiemVu,
  VERIFICATION_TIME,
  COOLDOWN_TIME
};