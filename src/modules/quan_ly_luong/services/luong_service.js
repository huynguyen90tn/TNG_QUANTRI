// File: src/modules/quan_ly_luong/services/luong_service.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { 
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../../../services/firebase';

const COLLECTION = 'salary';

const cleanSalaryData = (data) => {
  return {
    id: data.id || '',
    userId: data.userId || '',
    userName: data.userName || '',
    memberCode: data.memberCode || '',
    level: data.level || '',
    department: data.department || '',
    kyLuong: data.kyLuong || {
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear()
    },
    luongCoBan: Number(data.luongCoBan) || 0,
    luongThuong: Number(data.luongThuong) || 0,
    phuCap: {
      anUong: Number(data.phuCap?.anUong) || 0,
      diLai: Number(data.phuCap?.diLai) || 0, 
      dienThoai: Number(data.phuCap?.dienThoai) || 0,
      khac: Number(data.phuCap?.khac) || 0
    },
    thueTNCN: Number(data.thueTNCN) || 0,
    baoHiem: {
      bhyt: Number(data.baoHiem?.bhyt) || 0,
      bhxh: Number(data.baoHiem?.bhxh) || 0,
      bhtn: Number(data.baoHiem?.bhtn) || 0,
      dongBaoHiem: Boolean(data.baoHiem?.dongBaoHiem)
    },
    dongThue: Boolean(data.dongThue),
    tongThuNhap: Number(data.tongThuNhap) || 0,
    thucLinh: Number(data.thucLinh) || 0,
    ghiChu: data.ghiChu || '',
    trangThai: data.trangThai || 'CHO_DUYET',
    ngayTao: data.ngayTao instanceof Timestamp ? data.ngayTao.toDate() : new Date(),
    ngayCapNhat: data.ngayCapNhat instanceof Timestamp ? data.ngayCapNhat.toDate() : new Date(),
    nguoiTao: data.nguoiTao || '',
    thuongList: Array.isArray(data.thuongList) ? data.thuongList.map(item => ({
      amount: Number(item.amount) || 0,
      reason: item.reason || ''
    })) : [],
    phatList: Array.isArray(data.phatList) ? data.phatList.map(item => ({
      amount: Number(item.amount) || 0,
      reason: item.reason || ''
    })) : []
  };
};

const validateSalaryData = (data) => {
  const requiredFields = [
    'userId',
    'userName', 
    'memberCode',
    'level',
    'department',
    'kyLuong',
    'luongCoBan'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
  }

  if (!data.kyLuong?.thang || !data.kyLuong?.nam) {
    throw new Error('Thiếu thông tin kỳ lương');
  }

  if (!data.userId || !data.userName) {
    throw new Error('Thiếu thông tin người nhận lương');
  }

  return true;
};

export const getAllSalaries = async () => {
  try {
    const salariesRef = collection(db, COLLECTION);
    const q = query(
      salariesRef,
      orderBy('ngayTao', 'desc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    const salaries = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return cleanSalaryData({ 
        id: doc.id,
        ...data
      });
    });

    return { data: salaries };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lương:', error);
    throw new Error('Không thể tải danh sách lương: ' + error.message);
  }
};

export const getUserSalary = async (userId) => {
  try {
    if (!userId) {
      throw new Error('userId là bắt buộc');
    }

    const salariesRef = collection(db, COLLECTION);
    const q = query(
      salariesRef,
      where('userId', '==', userId),
      orderBy('ngayTao', 'desc'),
      limit(12)
    );

    const querySnapshot = await getDocs(q);
    const salaries = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return cleanSalaryData({
        id: doc.id,
        ...data
      });
    });

    return { data: salaries };
  } catch (error) {
    console.error('Lỗi khi lấy thông tin lương:', error);
    throw new Error('Không thể tải thông tin lương: ' + error.message);
  }
};

export const getSalaryByMonth = async (thang, nam) => {
  try {
    const salariesRef = collection(db, COLLECTION);
    const q = query(
      salariesRef,
      where('kyLuong.thang', '==', thang),
      where('kyLuong.nam', '==', nam),
      limit(100)
    );

    const querySnapshot = await getDocs(q);
    const salaries = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return cleanSalaryData({
        id: doc.id,
        ...data
      });
    });

    return { data: salaries };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lương theo tháng:', error);
    throw new Error('Không thể tải danh sách lương: ' + error.message);
  }
};

export const createSalary = async (salaryData) => {
  try {
    // Chuẩn bị dữ liệu
    const dataToSave = {
      userId: salaryData.userId,
      userName: salaryData.userName,
      memberCode: salaryData.memberCode,
      level: salaryData.level,
      department: salaryData.department,
      kyLuong: {
        thang: salaryData.kyLuong.thang || new Date().getMonth() + 1,
        nam: salaryData.kyLuong.nam || new Date().getFullYear()
      },
      luongCoBan: Number(salaryData.luongCoBan) || 0,
      luongThuong: Number(salaryData.luongThuong) || 0,
      phuCap: {
        anUong: Number(salaryData.phuCap?.anUong) || 0,
        diLai: Number(salaryData.phuCap?.diLai) || 0,
        dienThoai: Number(salaryData.phuCap?.dienThoai) || 0,
        khac: Number(salaryData.phuCap?.khac) || 0
      },
      baoHiem: {
        bhyt: Number(salaryData.baoHiem?.bhyt) || 0,
        bhxh: Number(salaryData.baoHiem?.bhxh) || 0,
        bhtn: Number(salaryData.baoHiem?.bhtn) || 0,
        dongBaoHiem: Boolean(salaryData.baoHiem?.dongBaoHiem)
      },
      thueTNCN: Number(salaryData.thueTNCN) || 0,
      tongThuNhap: Number(salaryData.tongThuNhap) || 0,
      thucLinh: Number(salaryData.thucLinh) || 0,
      ghiChu: salaryData.ghiChu || '',
      trangThai: 'CHO_DUYET',
      ngayTao: Timestamp.fromDate(new Date()),
      ngayCapNhat: Timestamp.fromDate(new Date()),
      nguoiTao: salaryData.nguoiTao || '',
      thuongList: Array.isArray(salaryData.thuongList) ? 
        salaryData.thuongList.map(item => ({
          amount: Number(item.amount) || 0,
          reason: item.reason || ''
        })) : [],
      phatList: Array.isArray(salaryData.phatList) ?
        salaryData.phatList.map(item => ({
          amount: Number(item.amount) || 0,
          reason: item.reason || ''
        })) : [],
      dongThue: Boolean(salaryData.dongThue)
    };

    // Validate 
    validateSalaryData(dataToSave);

    // Lưu vào database
    const docRef = await addDoc(collection(db, COLLECTION), dataToSave);

    // Kiểm tra kết quả
    const newDoc = await getDoc(docRef);
    if (!newDoc.exists()) {
      throw new Error('Không thể tạo bảng lương');
    }

    // Trả về dữ liệu đã tạo
    return cleanSalaryData({
      id: docRef.id,
      ...newDoc.data()
    });

  } catch (error) {
    console.error('Lỗi khi tạo bảng lương:', error);
    throw new Error(error.message || 'Không thể tạo bảng lương');
  }
};

export const updateSalary = async (salaryId, salaryData) => {
  try {
    if (!salaryId) {
      throw new Error('salaryId là bắt buộc');
    }

    // Chuẩn bị dữ liệu cập nhật
    const dataToUpdate = {
      ...salaryData,
      ngayCapNhat: Timestamp.fromDate(new Date()),
      // Chuyển đổi các trường số
      luongCoBan: Number(salaryData.luongCoBan) || 0,
      luongThuong: Number(salaryData.luongThuong) || 0,
      thueTNCN: Number(salaryData.thueTNCN) || 0,
      tongThuNhap: Number(salaryData.tongThuNhap) || 0,
      thucLinh: Number(salaryData.thucLinh) || 0,
      // Cập nhật phụ cấp
      phuCap: {
        anUong: Number(salaryData.phuCap?.anUong) || 0,
        diLai: Number(salaryData.phuCap?.diLai) || 0,
        dienThoai: Number(salaryData.phuCap?.dienThoai) || 0,
        khac: Number(salaryData.phuCap?.khac) || 0
      },
      // Cập nhật bảo hiểm 
      baoHiem: {
        bhyt: Number(salaryData.baoHiem?.bhyt) || 0,
        bhxh: Number(salaryData.baoHiem?.bhxh) || 0,
        bhtn: Number(salaryData.baoHiem?.bhtn) || 0,
        dongBaoHiem: Boolean(salaryData.baoHiem?.dongBaoHiem)
      }
    };

    const salaryRef = doc(db, COLLECTION, salaryId);
    
    await updateDoc(salaryRef, dataToUpdate);
    
    const updatedDoc = await getDoc(salaryRef);
    if (!updatedDoc.exists()) {
      throw new Error('Không tìm thấy bảng lương');
    }

    return cleanSalaryData({
      id: salaryId,
      ...updatedDoc.data() 
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật bảng lương:', error);
    throw new Error('Không thể cập nhật bảng lương: ' + error.message);
  }
};

export default {
  getAllSalaries,
  getUserSalary,
  getSalaryByMonth,
  createSalary,
  updateSalary
};