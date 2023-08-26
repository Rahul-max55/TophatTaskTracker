import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { FETCH_WRAPPER } from '../api';

const initialState = {
  tasks: [],
  allTasks:[],
  notes: [],
  attendance: [],
  loading: true,
  success: false,
  error: 'No error',
};

// fetching notes
export const getNotes = createAsyncThunk('/getNotes', async () => {
  try {
    const token = sessionStorage.getItem('authToken');
    const response = await FETCH_WRAPPER.get('notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data.notes;
  } catch (err) {
    return err.response.statusText;
  }
});

// fetching Tasks
export const getTasks = createAsyncThunk('/getTasks', async () => {
  try {
    const token = sessionStorage.getItem('authToken');
    const response = await FETCH_WRAPPER.get('tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.tasks;
  } catch (err) {
    return err.response.statusText;
  }
});

export const getAttendance = createAsyncThunk('/getAttendance', async () => {
  try {
    const token = sessionStorage.getItem('authToken');
    console.log(sessionStorage.getItem('assignTask'));
    const data = { email: sessionStorage.getItem('assignTask') };
    const response = await FETCH_WRAPPER.post('attendence', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      return response.data.data;
    }
  } catch (err) {
    return err;
  }
});

export const clearList = createAction('clearList');
export const updateList = createAction('updateList');
export const updateNote = createAction('updateNote');
export const editNote = createAction('editNote');
export const clearAttendance = createAction('clearAttendance');

const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTasks.pending, state => {
      state.loading = true;
      state.success = false;
      state.error = 'No error';
    });
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = 'No error';
      state.tasks = action.payload;
      state.allTasks = action.payload;
    });
    builder.addCase(getTasks.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
    builder.addCase(clearList, state => {
      state.loading = true;
      state.success = false;
      state.error = 'No error';
      state.tasks = [];
    });
    builder.addCase(updateList, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = 'No error';
      state['tasks'] = action.payload;
    });
    builder.addCase(getNotes.pending, state => {
      state.loading = true;
      state.success = false;
      state.error = 'No error';
    });
    builder.addCase(getNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = 'No error';
      state.notes = action.payload;
    });
    builder.addCase(getNotes.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
    builder.addCase('editNote', (state, action) => {
      state.loading = false;
      state.success = true;
      state.notes = action.payload;
    });
    builder.addCase('updateNote', (state, action) => {
      state.loading = false;
      state.success = true;
      state.notes = action.payload;
    });
    builder.addCase(getAttendance.pending, state => {
      state.loading = true;
      state.success = false;
      state.error = 'No error';
    });
    builder.addCase(getAttendance.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = 'No error';
      state.attendance = action.payload;
    });
    builder.addCase(getAttendance.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.attendance = [];
    });
    builder.addCase(clearAttendance, state => {
      state.loading = false;
      state.success = true;
      state.error = 'No error';
      state.attendance = [];
    });
  },
});

export default fetchSlice.reducer;
