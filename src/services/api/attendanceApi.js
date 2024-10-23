// src/services/api/attendanceApi.js
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export const attendanceApi = {
  submitAttendance: async (attendanceData) => {
    try {
      const attendanceRef = collection(db, 'attendance');
      const docRef = await addDoc(attendanceRef, {
        ...attendanceData,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      throw new Error('Không thể lưu thông tin điểm danh: ' + error.message);
    }
  },

  getAttendanceHistory: async (memberId, startDate, endDate) => {
    try {
      const attendanceRef = collection(db, 'attendance');
      const q = query(
        attendanceRef,
        where('memberId', '==', memberId),
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error('Không thể lấy lịch sử điểm danh: ' + error.message);
    }
  }
};