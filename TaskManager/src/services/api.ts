import axios from 'axios';
import { Task, TaskInput } from '@/types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TaskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    console.log("response.data",response.data)
    return response.data;
  },

  createTask: async (taskInput: TaskInput): Promise<Task> => {
    const task = {
      ...taskInput,
      completed: false,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(), // Temporary ID until backend provides one
    };

    const response = await api.post('/tasks', task);
    return response.data;
  },

  toggleTaskComplete: async (taskId: string): Promise<Task> => {
    const response = await api.put(`/tasks/${taskId}`);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
}; 