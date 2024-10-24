// src/services/api/taskApi.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
} from "firebase/firestore";

// Hàm tạo task mới
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...taskData };
  } catch (error) {
    throw new Error("Lỗi khi tạo nhiệm vụ: " + error.message);
  }
};

// Hàm cập nhật task
export const updateTask = async (taskId, taskData) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: new Date().toISOString(),
    });
    return { id: taskId, ...taskData };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật nhiệm vụ: " + error.message);
  }
};

// Hàm xóa task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    return true;
  } catch (error) {
    throw new Error("Lỗi khi xóa nhiệm vụ: " + error.message);
  }
};

// Hàm lấy chi tiết một task
export const getTask = async (taskId) => {
  try {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    if (!taskDoc.exists()) {
      throw new Error("Không tìm thấy nhiệm vụ");
    }
    return { id: taskDoc.id, ...taskDoc.data() };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin nhiệm vụ: " + error.message);
  }
};

// Hàm lấy danh sách tasks có filtering
export const getTasks = async (projectId = null, filters = {}) => {
  try {
    let tasksRef = collection(db, "tasks");
    const conditions = [];

    if (projectId) {
      conditions.push(where("projectId", "==", projectId));
    }

    if (filters.department) {
      conditions.push(where("department", "==", filters.department));
    }

    if (filters.status) {
      conditions.push(where("status", "==", filters.status));
    }

    let q = tasksRef;
    if (conditions.length > 0) {
      q = query(tasksRef, ...conditions);
    }

    const querySnapshot = await getDocs(q);
    const tasks = [];

    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    return { data: tasks };
  } catch (error) {
    throw new Error("Lỗi khi tải danh sách nhiệm vụ: " + error.message);
  }
};

// Hàm lấy tasks theo người được giao
export const getTasksByAssignee = async (assigneeId) => {
  try {
    // Sử dụng query đơn giản không cần index
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("assignee", "==", assigneeId));
    const querySnapshot = await getDocs(q);
    const tasks = [];

    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Sắp xếp ở client side để tránh phải tạo index
    tasks.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return { data: tasks };
  } catch (error) {
    throw new Error(
      "Lỗi khi tải danh sách nhiệm vụ của người dùng: " + error.message,
    );
  }
};

// Hàm lấy tasks theo department
export const getTasksByDepartment = async (department) => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("department", "==", department));
    const querySnapshot = await getDocs(q);
    const tasks = [];

    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    return { data: tasks };
  } catch (error) {
    throw new Error(
      "Lỗi khi tải danh sách nhiệm vụ theo phân hệ: " + error.message,
    );
  }
};

// Hàm cập nhật trạng thái task
export const updateTaskStatus = async (taskId, status, progress) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      status,
      progress,
      updatedAt: new Date().toISOString(),
    });
    return { id: taskId, status, progress };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật trạng thái nhiệm vụ: " + error.message);
  }
};
