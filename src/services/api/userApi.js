// src/services/api/userApi.js
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getUserList = async ({ role, department }) => {
  try {
    const usersRef = collection(db, 'users');
    let q = usersRef;

    if (role && department) {
      q = query(usersRef, 
        where('role', '==', role),
        where('department', '==', department)
      );
    } else if (role) {
      q = query(usersRef, where('role', '==', role));
    } else if (department) {
      q = query(usersRef, where('department', '==', department));
    }

    const querySnapshot = await getDocs(q);

    return {
      data: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách người dùng: ' + error.message);
  }
};

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    return {
      data: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách người dùng: ' + error.message);
  }
};

export const getDepartmentUsers = async (department) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('department', '==', department));
    const querySnapshot = await getDocs(q);

    return {
      data: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách người dùng theo phân hệ: ' + error.message);
  }
};