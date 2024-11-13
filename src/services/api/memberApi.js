// File: src/services/api/memberApi.js
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';

export const getMembers = async (filters = {}) => {
  try {
    const membersRef = collection(db, 'members');
    const conditions = [];

    if (filters.status) {
      conditions.push(where('status', '==', filters.status));
    }

    if (filters.department) {
      conditions.push(where('department', '==', filters.department));
    }

    const q = query(
      membersRef,
      ...conditions,
      orderBy('memberCode', 'asc')
    );

    const snapshot = await getDocs(q);
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { data: members };
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách thành viên: ' + error.message);
  }
};

export default {
  getMembers
};