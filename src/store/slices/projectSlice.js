import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/api/projectApi';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = await getProjects();
      return projects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const newProject = await createProject(projectData);
      return newProject;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editProject = createAsyncThunk(
  'projects/editProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const updatedProject = await updateProject(projectId, projectData);
      return updatedProject;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeProject = createAsyncThunk(
  'projects/removeProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project.id !== action.payload);
      });
  },
});

export default projectSlice.reducer;