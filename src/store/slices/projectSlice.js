import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../../services/api/projectApi';

// Constants for status values
const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
};

// Initial state
const initialState = {
  projects: [],
  status: STATUS.IDLE,
  error: null,
  currentProject: null
};

/**
 * Async thunk to fetch all projects
 */
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = await getProjects();
      if (!Array.isArray(projects)) {
        throw new Error('Invalid response format');
      }
      return projects;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tải danh sách dự án';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunk to create a new project
 */
export const addProject = createAsyncThunk(
  'projects/addProject',
  async (projectData, { rejectWithValue }) => {
    try {
      if (!projectData) {
        throw new Error('Project data is required');
      }
      const newProject = await createProject(projectData);
      return newProject;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tạo dự án';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunk to update an existing project
 */
export const editProject = createAsyncThunk(
  'projects/editProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      if (!projectId || !projectData) {
        throw new Error('Project ID and data are required');
      }
      const updatedProject = await updateProject(projectId, projectData);
      return updatedProject;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật dự án';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunk to remove a project
 */
export const removeProject = createAsyncThunk(
  'projects/removeProject',
  async (projectId, { rejectWithValue }) => {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }
      await deleteProject(projectId);
      return projectId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể xóa dự án';
      return rejectWithValue(message);
    }
  }
);

/**
 * Project slice with reducers and extra reducers for async actions
 */
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = STATUS.IDLE;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects cases
      .addCase(fetchProjects.pending, (state) => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEEDED;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.payload;
      })

      // Add project cases
      .addCase(addProject.pending, (state) => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEEDED;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.payload;
      })

      // Edit project cases
      .addCase(editProject.pending, (state) => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEEDED;
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(editProject.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.payload;
      })

      // Remove project cases
      .addCase(removeProject.pending, (state) => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEEDED;
        state.projects = state.projects.filter(project => project.id !== action.payload);
        state.error = null;
      })
      .addCase(removeProject.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { 
  setCurrentProject, 
  clearError, 
  resetStatus 
} = projectSlice.actions;

// Export selectors
export const selectAllProjects = (state) => state.projects.projects;
export const selectProjectStatus = (state) => state.projects.status;
export const selectProjectError = (state) => state.projects.error;
export const selectCurrentProject = (state) => state.projects.currentProject;

// Export reducer
export default projectSlice.reducer;