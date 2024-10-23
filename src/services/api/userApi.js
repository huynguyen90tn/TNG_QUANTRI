// src/services/api/userApi.js
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getUserList = async ({ role }) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', role));
  const querySnapshot = await getDocs(q);

  return {
    data: querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    })),
  };
};
