// src/components/quan_ly_nhiem_vu_chi_tiet/store/nhiem_vu_slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import nhiemVuApi from '../api/nhiem_vu_api';

// Project Actions
export const fetchProject = createAsyncThunk(
  'nhiemVu/fetchProject',
  async (projectId) => {
    const response = await nhiemVuApi.getProject(projectId);
    return response.data;
  }
);

// Tính năng Actions
export const fetchTinhNangList = createAsyncThunk(
  'nhiemVu/fetchTinhNang',
  async (projectId) => {
    const response = await nhiemVuApi.getTinhNang(projectId);
    return response.data;
  }
);

export const createTinhNang = createAsyncThunk(
  'nhiemVu/createTinhNang',
  async (data) => {
    const response = await nhiemVuApi.createTinhNang(data);
    return response.data;
  }
);

export const updateTinhNang = createAsyncThunk(
  'nhiemVu/updateTinhNang',
  async ({ id, ...data }) => {
    const response = await nhiemVuApi.updateTinhNang(id, data);
    return response.data;
  }
);

export const deleteTinhNang = createAsyncThunk(
  'nhiemVu/deleteTinhNang',
  async (id) => {
    await nhiemVuApi.deleteTinhNang(id);
    return id;
  }
);

// Backend Actions
export const fetchBackendList = createAsyncThunk(
  'nhiemVu/fetchBackend',
  async (projectId) => {
    const response = await nhiemVuApi.getBackend(projectId);
    return response.data;
  }
);

export const createBackend = createAsyncThunk(
  'nhiemVu/createBackend',
  async (data) => {
    const response = await nhiemVuApi.createBackend(data);
    return response.data;
  }
);

export const updateBackend = createAsyncThunk(
  'nhiemVu/updateBackend',
  async ({ id, ...data }) => {
    const response = await nhiemVuApi.updateBackend(id, data);
    return response.data;
  }
);

export const deleteBackend = createAsyncThunk(
  'nhiemVu/deleteBackend',
  async (id) => {
    await nhiemVuApi.deleteBackend(id);
    return id;
  }
);

// Kiểm thử Actions
export const fetchKiemThuList = createAsyncThunk(
  'nhiemVu/fetchKiemThu',
  async (projectId) => {
    const response = await nhiemVuApi.getKiemThu(projectId);
    return response.data;
  }
);

export const createKiemThu = createAsyncThunk(
  'nhiemVu/createKiemThu',
  async (data) => {
    const response = await nhiemVuApi.createKiemThu(data);
    return response.data;
  }
);

export const updateKiemThu = createAsyncThunk(
  'nhiemVu/updateKiemThu',
  async ({ id, ...data }) => {
    const response = await nhiemVuApi.updateKiemThu(id, data);
    return response.data;
  }
);

export const deleteKiemThu = createAsyncThunk(
  'nhiemVu/deleteKiemThu',
  async (id) => {
    await nhiemVuApi.deleteKiemThu(id);
    return id;
  }
);

// Tổng hợp Actions
export const fetchTongHopList = createAsyncThunk(
  'nhiemVu/fetchTongHop',
  async (projectId) => {
    const response = await nhiemVuApi.getTongHop(projectId);
    return response.data;
  }
);

const initialState = {
  tinhNangList: [],
  backendList: [],
  kiemThuList: [],
  tongHopList: [],
  projectInfo: null,
  selectedItem: null,
  loading: false,
  error: null,
};

const nhiemVuSlice = createSlice({
  name: 'nhiemVu',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    // Project
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projectInfo = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Tính năng
    builder
      .addCase(fetchTinhNangList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTinhNangList.fulfilled, (state, action) => {
        state.loading = false;
        state.tinhNangList = action.payload;
      })
      .addCase(fetchTinhNangList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTinhNang.fulfilled, (state, action) => {
        state.tinhNangList.push(action.payload);
      })
      .addCase(updateTinhNang.fulfilled, (state, action) => {
        const index = state.tinhNangList.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.tinhNangList[index] = action.payload;
        }
      })
      .addCase(deleteTinhNang.fulfilled, (state, action) => {
        state.tinhNangList = state.tinhNangList.filter(item => item.id !== action.payload);
      });

    // Backend
    builder
      .addCase(fetchBackendList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBackendList.fulfilled, (state, action) => {
        state.loading = false;
        state.backendList = action.payload;
      })
      .addCase(fetchBackendList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBackend.fulfilled, (state, action) => {
        state.backendList.push(action.payload);
      })
      .addCase(updateBackend.fulfilled, (state, action) => {
        const index = state.backendList.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.backendList[index] = action.payload;
        }
      })
      .addCase(deleteBackend.fulfilled, (state, action) => {
        state.backendList = state.backendList.filter(item => item.id !== action.payload);
      });

    // Kiểm thử
    builder
      .addCase(fetchKiemThuList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKiemThuList.fulfilled, (state, action) => {
        state.loading = false;
        state.kiemThuList = action.payload;
      })
      .addCase(fetchKiemThuList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createKiemThu.fulfilled, (state, action) => {
        state.kiemThuList.push(action.payload);
      })
      .addCase(updateKiemThu.fulfilled, (state, action) => {
        const index = state.kiemThuList.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.kiemThuList[index] = action.payload;
        }
      })
      .addCase(deleteKiemThu.fulfilled, (state, action) => {
        state.kiemThuList = state.kiemThuList.filter(item => item.id !== action.payload);
      });

    // Tổng hợp
    builder
      .addCase(fetchTongHopList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTongHopList.fulfilled, (state, action) => {
        state.loading = false;
        state.tongHopList = action.payload;
      })
      .addCase(fetchTongHopList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedItem, clearSelectedItem } = nhiemVuSlice.actions;
export default nhiemVuSlice.reducer;