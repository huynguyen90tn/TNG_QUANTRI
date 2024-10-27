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
  Timestamp
} from "firebase/firestore";

// Deep clean function to handle nested objects and arrays
const deepClean = (obj) => {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => deepClean(item))
      .filter((item) => item !== undefined && item !== null);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, deepClean(value)])
    );
  }
  return obj;
};

// Task data validator and cleaner
const cleanTaskData = (data) => {
  const cleanData = {
    title: data.title || '',
    department: data.department || '',
    description: data.description || '',
    taskId: data.taskId || '',
    assignees: data.assignees?.map(assignee => ({
      id: assignee.id || '',
      name: assignee.name || '',
      email: assignee.email || '',
      progress: Number(assignee.progress) || 0,
      notes: assignee.notes || ''
    })) || [],
    subTasks: data.subTasks?.map(subTask => ({
      title: subTask.title || '',
      progress: Number(subTask.progress) || 0,
      notes: subTask.notes || '',
      assignees: subTask.assignees?.map(assignee => ({
        id: assignee.id || '',
        name: assignee.name || '',
        email: assignee.email || '',
        progress: Number(assignee.progress) || 0,
        notes: assignee.notes || ''
      })) || []
    })) || [],
    status: data.status || 'pending',
    progress: Number(data.progress) || 0,
    deadline: data.deadline || null,
    createdAt: data.createdAt || Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  return deepClean(cleanData);
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    if (!taskData.title || !taskData.department) {
      throw new Error("Tiêu đề và phân hệ là bắt buộc");
    }

    const cleanedData = cleanTaskData(taskData);
    const docRef = await addDoc(collection(db, "tasks"), cleanedData);
    return { id: docRef.id, ...cleanedData };
  } catch (error) {
    throw new Error("Lỗi khi tạo nhiệm vụ: " + error.message);
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    if (!taskId) {
      throw new Error("TaskId là bắt buộc");
    }

    const cleanedData = cleanTaskData(taskData);
    const taskRef = doc(db, "tasks", taskId);
    
    // Verify task exists before updating
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      throw new Error("Không tìm thấy nhiệm vụ");
    }

    await updateDoc(taskRef, cleanedData);
    return { id: taskId, ...cleanedData };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật nhiệm vụ: " + error.message);
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    if (!taskId) {
      throw new Error("TaskId là bắt buộc");
    }

    const taskRef = doc(db, "tasks", taskId);
    
    // Verify task exists before deleting
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      throw new Error("Không tìm thấy nhiệm vụ");
    }

    await deleteDoc(taskRef);
    return true;
  } catch (error) {
    throw new Error("Lỗi khi xóa nhiệm vụ: " + error.message);
  }
};

// Get a single task by ID
export const getTask = async (taskId) => {
  try {
    if (!taskId) {
      throw new Error("TaskId là bắt buộc");
    }

    const docSnap = await getDoc(doc(db, "tasks", taskId));
    if (!docSnap.exists()) {
      throw new Error("Không tìm thấy nhiệm vụ");
    }
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin nhiệm vụ: " + error.message);
  }
};

// Get tasks with filters
export const getTasks = async (projectId = null, filters = {}) => {
  try {
    let q = collection(db, "tasks");
    const conditions = [];

    // Build query conditions
    if (projectId) {
      conditions.push(where("projectId", "==", projectId));
    }

    if (filters.department) {
      conditions.push(where("department", "==", filters.department));
    }

    if (filters.status) {
      conditions.push(where("status", "==", filters.status));
    }

    // Add default sorting by updatedAt
    conditions.push(orderBy("updatedAt", "desc"));

    // Apply query conditions
    if (conditions.length > 0) {
      q = query(q, ...conditions);
    }

    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Apply client-side search if provided
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return {
        data: tasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm) ||
          task.taskId.toLowerCase().includes(searchTerm)
        )
      };
    }

    return { data: tasks };
  } catch (error) {
    throw new Error("Lỗi khi tải danh sách nhiệm vụ: " + error.message);
  }
};

// Get tasks by assignee
export const getTasksByAssignee = async (assigneeId) => {
  try {
    if (!assigneeId) {
      throw new Error("AssigneeId là bắt buộc");
    }

    const q = query(
      collection(db, "tasks"),
      where("assignees", "array-contains", assigneeId),
      orderBy("updatedAt", "desc")
    );

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

// Get tasks by department
export const getTasksByDepartment = async (department) => {
  try {
    if (!department) {
      throw new Error("Department là bắt buộc");
    }

    const q = query(
      collection(db, "tasks"),
      where("department", "==", department),
      orderBy("updatedAt", "desc")
    );

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

export default {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksByAssignee,
  getTasksByDepartment
};