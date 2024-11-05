// File: src/modules/nhiem_vu_hang_ngay/services/nhiem_vu_service.js
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
  arrayUnion,
  arrayRemove,
  runTransaction,
  getDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'nhiem_vu_hang_ngay';
const COOLDOWN_TIME = 120000; // 2 phút cooldown
const VERIFICATION_TIME = 60000; // 1 phút kiểm tra

const PHONG_BAN_HOP_LE = [
  'thien-minh-duong',
  'tay-van-cac',
  'hoa-tam-duong',
  'ho-ly-son-trang',
  'hoa-van-cac',
  'tinh-van-cac'
];

const convertToTimestamp = (date) => {
  if (!date) return Timestamp.now();
  
  try {
    if (date instanceof Timestamp) return date;
    
    const dateObj = typeof date === 'string' 
      ? new Date(date.replace(' UTC+7', ''))
      : date;
      
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      return Timestamp.fromDate(dateObj);
    }
    
    return Timestamp.now();
  } catch (error) {
    console.error('Lỗi chuyển đổi timestamp:', error);
    return Timestamp.now();
  }
};

const getDateRange = (startDate, endDate, filterType) => {
  const start = new Date(startDate || Date.now());
  let end;

  // Reset thời gian về 00:00:00
  start.setHours(0, 0, 0, 0);

  if (filterType === 'month') {
    // Lấy ngày cuối cùng của tháng 
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  } else {
    end = endDate ? new Date(endDate) : new Date(start);
    end.setHours(23, 59, 59, 999);
  }

  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end)
  };
};

export const taoNhiemVu = async (nhiemVuData) => {
  try {
    // Xử lý thời gian từ form
    const ngayBatDau = new Date(nhiemVuData.thoiGianThucHien.batDau);
    const ngayKetThuc = new Date(nhiemVuData.thoiGianThucHien.ketThuc);
    const [hours, minutes] = nhiemVuData.thoiGianThucHien.gio.split(':');
    
    ngayBatDau.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    ngayKetThuc.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const normalizedData = {
      tieuDe: nhiemVuData.tieuDe || '',
      moTa: nhiemVuData.moTa || '',
      loaiNhiemVu: nhiemVuData.loaiNhiemVu || 'like',
      duongDan: nhiemVuData.duongDan || '',
      ngayBatDau: Timestamp.fromDate(ngayBatDau),
      ngayKetThuc: Timestamp.fromDate(ngayKetThuc),
      ngayTao: Timestamp.fromDate(ngayBatDau),
      ngayCapNhat: Timestamp.now(),
      trangThai: 'chua_hoan_thanh',
      danhSachHoanThanh: [],
      danhSachDangKiemTra: [],
      nguoiTao: nhiemVuData.nguoiTao || null,
      thoiGianThucHien: {
        gio: nhiemVuData.thoiGianThucHien.gio,
        lapLai: nhiemVuData.thoiGianThucHien.lapLai,
        thuTrongTuan: nhiemVuData.thoiGianThucHien.thuTrongTuan
      },
      phongBan: Array.isArray(nhiemVuData.phongBan)
        ? nhiemVuData.phongBan.filter(dept => PHONG_BAN_HOP_LE.includes(dept))
        : []
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), normalizedData);
    const newDoc = await getDoc(docRef);

    if (!newDoc.exists()) {
      throw new Error('Tạo nhiệm vụ thất bại');
    }

    const data = newDoc.data();
    return {
      id: docRef.id,
      ...data,
      ngayTao: data.ngayTao.toDate(),
      ngayBatDau: data.ngayBatDau.toDate(),
      ngayKetThuc: data.ngayKetThuc.toDate(),
      ngayCapNhat: data.ngayCapNhat.toDate()
    };
  } catch (error) {
    console.error('Chi tiết lỗi tạo nhiệm vụ:', error);
    throw new Error(`Lỗi khi tạo nhiệm vụ: ${error.message}`);
  }
};

export const layDanhSachNhiemVu = async (startDate, endDate, filterType = 'day') => {
  try {
    const { start, end } = getDateRange(startDate, endDate, filterType);
    
    console.log('Query time range:', {
      start: start.toDate().toISOString(),
      end: end.toDate().toISOString(),
      filterType
    });

    const nhiemVuRef = collection(db, COLLECTION_NAME);
    const q = query(
      nhiemVuRef,
      where('ngayBatDau', '>=', start),
      where('ngayBatDau', '<=', end),
      orderBy('ngayBatDau', 'asc')
    );

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        ngayTao: data.ngayTao?.toDate() || new Date(),
        ngayBatDau: data.ngayBatDau?.toDate() || new Date(),
        ngayKetThuc: data.ngayKetThuc?.toDate() || new Date(),
        ngayCapNhat: data.ngayCapNhat?.toDate() || new Date(),
        danhSachHoanThanh: (data.danhSachHoanThanh || []).map(item => ({
          ...item,
          thoiGian: item.thoiGian?.toDate() || new Date()
        })),
        danhSachDangKiemTra: (data.danhSachDangKiemTra || []).map(item => ({
          ...item,
          thoiGianBatDau: item.thoiGianBatDau?.toDate() || new Date(),
          thoiGianKetThuc: item.thoiGianKetThuc?.toDate() || new Date()
        }))
      };
    });
  } catch (error) {
    console.error('Chi tiết lỗi:', error);
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

      const lastCompletion = nhiemVuData.danhSachHoanThanh?.find(
        completion => completion.userId === userId
      );

      if (lastCompletion?.thoiGian) {
        const lastCompletionDate = lastCompletion.thoiGian.toDate();
        const timeSinceLastCompletion = Date.now() - lastCompletionDate.getTime();
        if (timeSinceLastCompletion < COOLDOWN_TIME) {
          const remainingCooldown = Math.ceil((COOLDOWN_TIME - timeSinceLastCompletion) / 1000);
          throw new Error(`Vui lòng đợi ${remainingCooldown} giây trước khi thực hiện nhiệm vụ tiếp theo`);
        }
      }

      const isVerifying = nhiemVuData.danhSachDangKiemTra?.some(item => {
        const endTime = item.thoiGianKetThuc.toDate();
        return item.userId === userId && endTime.getTime() > Date.now();
      });

      if (isVerifying) {
        throw new Error('Bạn đang trong quá trình kiểm tra nhiệm vụ này');
      }

      const now = Timestamp.now();
      const kiemTraData = {
        userId,
        thoiGianBatDau: now,
        thoiGianKetThuc: Timestamp.fromMillis(now.toMillis() + VERIFICATION_TIME)
      };

      transaction.update(nhiemVuRef, {
        danhSachDangKiemTra: arrayUnion(kiemTraData),
        ngayCapNhat: now
      });

      return {
        batDau: now.toMillis(),
        ketThuc: now.toMillis() + VERIFICATION_TIME
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
      const dangKiemTra = nhiemVuData.danhSachDangKiemTra?.find(
        item => item.userId === userId
      );

      if (!dangKiemTra) {
        throw new Error('Không tìm thấy thông tin kiểm tra');
      }

      const now = Timestamp.now();
      const updateData = {
        danhSachDangKiemTra: arrayRemove(dangKiemTra),
        ngayCapNhat: now
      };

      if (ketQua) {
        const hoanThanhData = {
          userId,
          thoiGian: now,
          ketQua
        };
        updateData.danhSachHoanThanh = arrayUnion(hoanThanhData);
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

// Xuất các giá trị constant và tất cả các functions
export default {
  taoNhiemVu,
  layDanhSachNhiemVu,
  batDauKiemTra,
  hoanThanhKiemTra,
  xoaNhiemVu,
  layThongKeNhiemVu,
  VERIFICATION_TIME,
  COOLDOWN_TIME,
  PHONG_BAN_HOP_LE,
  getDateRange,
  convertToTimestamp
};