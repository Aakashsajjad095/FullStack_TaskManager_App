import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskInput } from '@/types';
import { TaskService } from '@/services/api';
import { DUMMY_TASKS } from '@/constants/dummyData';
import { RootState } from '@/store';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await TaskService.getTasks();
      return tasks;
    } catch (error) {
      return rejectWithValue('Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskInput: TaskInput, { rejectWithValue }) => {
    try {
      // First try to save to API
      const newTask = await TaskService.createTask(taskInput);
      return newTask;
    } catch (error) {
      // If API fails, create a local task
      const localTask: Task = {
        ...taskInput,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      return localTask;
    }
  }
);

export const toggleTask = createAsyncThunk(
  'tasks/toggleTask',
  async (taskId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const task = state.tasks.tasks.find(t => t.id === taskId);
    
    if (!task) {
      return rejectWithValue('Task not found');
    }

    try {
      // Send the opposite of current completion status
      const updatedTask = await TaskService.toggleTaskComplete(taskId);
      return updatedTask;
    } catch (error) {
      // If API fails, we'll revert in the reducer
      return rejectWithValue('Failed to toggle task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await TaskService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue('Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        console.log("action.payload",action.payload.length)
        state.isLoading = false;
        state.tasks = action.payload?.data?.length > 0 ? action.payload.data : DUMMY_TASKS;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.tasks = DUMMY_TASKS;
      })
      // Add task
      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Toggle task - optimistic update
      .addCase(toggleTask.pending, (state, action) => {
        const taskId = action.meta.arg;
        const taskIndex = state.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].completed = !state.tasks[taskIndex].completed;
        }
      })
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
      })
      .addCase(toggleTask.rejected, (state, action) => {
        // Revert the optimistic update if the API call fails
        const taskId = action.meta.arg;
        const taskIndex = state.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].completed = !state.tasks[taskIndex].completed;
        }
        state.error = action.payload as string;
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer; 