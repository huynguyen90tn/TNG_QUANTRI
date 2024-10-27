// src/components/quan_ly_nhiem_vu_chi_tiet/store/thong_ke_slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import thongKeApi from '../api/thong_ke_api';

export const fetchThongKeData = createAsyncThunk(
  'thongKe/fetchData',
  async (params) => {
    const response = await thongKeApi.getThongKe(params);
    return response.data;
  }
);

export const fetchTienDoChart = createAsyncThunk(
  'thongKe/fetchTienDo',
  async (params) => {
    const response = await thongKeApi.getTienDo(params);
    return response.data;
  }
);

const initialState = {
  thongKeData: null,
  tienDoData: [],
  loading: false,
  error: null
};

const thongKeSlice = createSlice({
  name: 'thongKe',
  initialState,
  reducers: {
    clearThongKe: (state) => {
      state.thongKeData = null;
      state.tienDoData = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch thống kê
      .addCase(fetchThongKeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThongKeData.fulfilled, (state, action) => {
        state.loading = false;
        state.thongKeData = action.payload;
      })
      .addCase(fetchThongKeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch tiến độ
      .addCase(fetchTienDoChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTienDoChart.fulfilled, (state, action) => {
        state.loading = false;
        state.tienDoData = action.payload;
      })
      .addCase(fetchTienDoChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearThongKe } = thongKeSlice.actions;
export default thongKeSlice.reducer;

// src/components/quan_ly_nhiem_vu_chi_tiet/api/thong_ke_api.js
import { db } from '../../../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';

const getThongKe = async (params = {}) => {
  try {
    const { projectId, startDate, endDate } = params;
    
    // Build query
    let q = collection(db, 'nhiem_vu');
    const conditions = [];

    if (projectId) {
      conditions.push(where('projectId', '==', projectId));
    }

    if (startDate) {
      conditions.push(where('createdAt', '>=', Timestamp.fromDate(new Date(startDate))));
    }

    if (endDate) {
      conditions.push(where('createdAt', '<=', Timestamp.fromDate(new Date(endDate))));
    }

    if (conditions.length > 0) {
      q = query(q, ...conditions);
    }

    // Get data
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const overdueTasks = tasks.filter(task => {
      const deadline = task.deadline?.toDate();
      return deadline && deadline < new Date() && task.status !== 'completed';
    }).length;

    return {
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0
      }
    };
  } catch (error) {
    throw new Error('Lỗi khi lấy thống kê: ' + error.message);
  }
};

const getTienDo = async (params = {}) => {
  try {
    const { projectId, days = 30 } = params;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query
    let q = collection(db, 'nhiem_vu');
    const conditions = [
      where('createdAt', '>=', Timestamp.fromDate(startDate))
    ];

    if (projectId) {
      conditions.push(where('projectId', '==', projectId));
    }

    q = query(q, ...conditions);

    // Get data
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Process data for chart
    const dateRange = [...Array(days)].map((_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const chartData = dateRange.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskDate = task.createdAt.toDate().toISOString().split('T')[0];
        return taskDate === date;
      });

      return {
        date,
        tinhNang: dayTasks.filter(t => t.type === 'feature').length,
        backend: dayTasks.filter(t => t.type === 'backend').length,
        kiemThu: dayTasks.filter(t => t.type === 'testing').length
      };
    });

    return { data: chartData };
  } catch (error) {
    throw new Error('Lỗi khi lấy dữ liệu tiến độ: ' + error.message);
  }
};

export default {
  getThongKe,
  getTienDo
};