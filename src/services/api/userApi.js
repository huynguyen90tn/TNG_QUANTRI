// File: src/services/api/userApi.js  
// Link tham khảo: https://firebase.google.com/docs/firestore
// Link tham khảo: https://firebase.google.com/docs/reference/js/firestore_
// Nhánh: main

import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  or,
  and
} from "firebase/firestore";

// Clean user data before returning
const cleanUserData = (userData) => {
  return {
    id: userData.id || '',
    email: userData.email || '',
    fullName: userData.fullName || '',
    role: userData.role || '',
    department: userData.department || '',
    avatar: userData.avatar || '',
    status: userData.status || 'active',
    phone: userData.phone || '',
    position: userData.position || '',
    createdAt: userData.createdAt || Timestamp.now(),
    updatedAt: Timestamp.now(),
    ...userData
  };
};

/**
 * Get filtered list of users based on role, department & status
 */
export const getUserList = async ({ role, department, status = 'active' } = {}) => {
  try {
    const usersRef = collection(db, "users");
    const conditions = [];

    if (role) {
      conditions.push(where("role", "==", role));
    }

    if (department) {
      conditions.push(where("department", "==", department));
    }

    if (status) {
      conditions.push(where("status", "==", status)); 
    }

    // Apply query
    const q = conditions.length > 0 
      ? query(usersRef, ...conditions, orderBy("fullName", "asc"))
      : query(usersRef, orderBy("fullName", "asc"));

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => 
      cleanUserData({ id: doc.id, ...doc.data() })
    );

    return { data: users };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message);
  }
};

/**
 * Get users by multiple departments and roles
 */
export const getUsersByDepartmentsAndRoles = async (departments = [], roles = [], status = 'active') => {
  try {
    if (!departments.length && !roles.length) {
      throw new Error("Phải chọn ít nhất 1 phòng ban hoặc vai trò");
    }

    const usersRef = collection(db, "users");
    const conditions = [];

    if (departments.length) {
      conditions.push(where("department", "in", departments));
    }

    if (roles.length) {
      conditions.push(where("role", "in", roles));
    }

    if (status) {
      conditions.push(where("status", "==", status));
    }

    const q = query(usersRef, ...conditions, orderBy("fullName", "asc"));
    const querySnapshot = await getDocs(q);

    return {
      data: querySnapshot.docs.map(doc => 
        cleanUserData({ id: doc.id, ...doc.data() })
      )
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message); 
  }
};

/**
 * Get all users in the system
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("fullName", "asc"));
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => 
      cleanUserData({ id: doc.id, ...doc.data() })
    );

    return { data: users };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message);
  }
};

/**
 * Get users filtered by department
 */
export const getDepartmentUsers = async (department) => {
  try {
    if (!department) {
      throw new Error("Department là bắt buộc");
    }

    const usersRef = collection(db, "users");
    const q = query(
      usersRef, 
      where("department", "==", department),
      where("status", "==", "active"),
      orderBy("fullName", "asc")
    );

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => 
      cleanUserData({ id: doc.id, ...doc.data() })
    );

    return { data: users };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách người dùng theo phân hệ: " + error.message
    );
  }
};

/**
 * Get active users only
 */ 
export const getActiveUsers = async (filters = {}) => {
  try {
    const usersRef = collection(db, "users");
    const conditions = [where("status", "==", "active")];

    if (filters.role) {
      conditions.push(where("role", "==", filters.role));
    }

    if (filters.department) {
      conditions.push(where("department", "==", filters.department));
    }

    const q = query(usersRef, ...conditions, orderBy("fullName", "asc")); 
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => 
      cleanUserData({ id: doc.id, ...doc.data() })
    );

    return { data: users };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng đang hoạt động: " + error.message);
  }
};

/**
 * Create new user
 */
export const createUser = async (userData) => {
  try {
    const cleanedData = cleanUserData(userData);
    const docRef = await addDoc(collection(db, "users"), cleanedData);
    return { id: docRef.id, ...cleanedData };
  } catch (error) {
    throw new Error("Lỗi khi tạo người dùng: " + error.message);
  }
};

/**
 * Update existing user
 */
export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    const cleanedData = cleanUserData(userData);
    await updateDoc(userRef, cleanedData);
    return { id: userId, ...cleanedData };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật người dùng: " + error.message);
  }
};

/**
 * Delete user 
 */
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    return true;
  } catch (error) {
    throw new Error("Lỗi khi xóa người dùng: " + error.message);
  }
};

/**
 * Get single user by ID
 */
export const getUser = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (!docSnap.exists()) {
      throw new Error("Không tìm thấy người dùng");
    }
    return cleanUserData({ id: docSnap.id, ...docSnap.data() });
  } catch (error) { 
    throw new Error("Lỗi khi lấy thông tin người dùng: " + error.message);
  }
};

export default {
  getUserList,
  getAllUsers,
  getDepartmentUsers,
  getActiveUsers,
  createUser, 
  updateUser,
  deleteUser,
  getUser,
  getUsersByDepartmentsAndRoles
};