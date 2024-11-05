// Link file: src/services/api/attendanceApi.js

import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

const ATTENDANCE_COLLECTION = "attendance";

const ATTENDANCE_TYPES = {
  CHECK_IN: 'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT'
};

// Hàm kiểm tra dữ liệu bắt buộc
const validateAttendanceData = (data) => {
  const requiredFields = ['userId', 'userName', 'type', 'location', 'department'];
  const missingFields = requiredFields.filter(field => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
  }

  if (!Object.values(ATTENDANCE_TYPES).includes(data.type)) {
    throw new Error('Loại điểm danh không hợp lệ');
  }
};

// Hàm chuẩn hóa dữ liệu trước khi lưu
const cleanAttendanceData = (rawData) => {
  // Đảm bảo các trường không bị undefined
  const data = {
    userId: rawData.userId || '',
    userName: rawData.userName || '',
    type: rawData.type || ATTENDANCE_TYPES.CHECK_IN,
    location: rawData.location || '',
    department: rawData.department || '',
    note: rawData.note || '',
    deviceInfo: rawData.deviceInfo || '',
    // Sử dụng timestamp từ server cho thời gian chính xác
    timestamp: serverTimestamp(),
    // Lưu thêm thời gian local để dễ query
    localTimestamp: Timestamp.now(),
    createdAt: Timestamp.now(),
    status: rawData.status || 'ACTIVE',
  };

  return data;
};

export const attendanceApi = {
  /**
   * Ghi nhận điểm danh cho người dùng
   * @param {Object} attendanceData Dữ liệu điểm danh
   * @returns {Promise<Object>} Thông tin bản ghi điểm danh đã tạo
   */
  submitAttendance: async (attendanceData) => {
    try {
      // Validate dữ liệu đầu vào
      validateAttendanceData(attendanceData);

      // Chuẩn hóa dữ liệu
      const cleanedData = cleanAttendanceData(attendanceData);

      // Thêm vào Firestore
      const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
      const docRef = await addDoc(attendanceRef, cleanedData);

      return {
        id: docRef.id,
        ...cleanedData,
      };
    } catch (error) {
      console.error('Lỗi khi lưu điểm danh:', error);
      throw new Error(`Không thể lưu thông tin điểm danh: ${error.message}`);
    }
  },

  /**
   * Lấy lịch sử điểm danh của người dùng
   * @param {string} userId ID của người dùng
   * @param {Date} startDate Ngày bắt đầu
   * @param {Date} endDate Ngày kết thúc
   * @returns {Promise<Array>} Danh sách các bản ghi điểm danh
   */
  getAttendanceHistory: async (userId, startDate, endDate) => {
    try {
      if (!userId) {
        throw new Error('userId là bắt buộc');
      }

      if (!startDate || !endDate) {
        throw new Error('startDate và endDate là bắt buộc');
      }

      const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
      
      const startTimestamp = Timestamp.fromDate(new Date(startDate));
      const endTimestamp = Timestamp.fromDate(new Date(endDate));

      const q = query(
        attendanceRef,
        where('userId', '==', userId),
        where('localTimestamp', '>=', startTimestamp),
        where('localTimestamp', '<=', endTimestamp)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamps to Date objects
        timestamp: doc.data().timestamp?.toDate(),
        localTimestamp: doc.data().localTimestamp?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử điểm danh:', error);
      throw new Error(`Không thể lấy lịch sử điểm danh: ${error.message}`);
    }
  },

  /**
   * Lấy điểm danh trong ngày của người dùng
   * @param {string} userId ID của người dùng
   * @returns {Promise<Object|null>} Bản ghi điểm danh hoặc null
   */
  getTodayAttendance: async (userId) => {
    try {
      if (!userId) {
        throw new Error('userId là bắt buộc');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
      const q = query(
        attendanceRef,
        where('userId', '==', userId),
        where('localTimestamp', '>=', Timestamp.fromDate(today)),
        where('localTimestamp', '<', Timestamp.fromDate(tomorrow))
      );

      const querySnapshot = await getDocs(q);
      const attendances = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        localTimestamp: doc.data().localTimestamp?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      return attendances[0] || null;
    } catch (error) {
      console.error('Lỗi khi lấy điểm danh hôm nay:', error);
      throw new Error(`Không thể lấy điểm danh hôm nay: ${error.message}`);
    }
  }
};

export default attendanceApi;