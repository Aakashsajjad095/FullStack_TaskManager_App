// src/models/taskModel.js
import { db } from '../config/firebase.js';

// Helper function to format timestamp into a readable date (dd/mm/yyyy)
const formatDate = (timestamp) => {
  if (!timestamp) return null;

  const date = new Date(timestamp);  // Convert timestamp to Date object
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Get all tasks
const getAllTasks = async () => {
  const snapshot = await db.collection('tasks').orderBy('createdAt', 'desc').get();
  
  // Format the dueDate as a readable string when fetching tasks
  const tasks = snapshot.docs.map(doc => {
    const taskData = doc.data();
    return {
      id: doc.id,
      ...taskData,
      dueDate: taskData.dueDate ? formatDate(taskData.dueDate) : null  // Format timestamp to string
    };
  });

  return tasks;
};

// Create a new task
const createTask = async (taskData) => {
  // Save the task with dueDate as timestamp (millisecond timestamp)
  const taskRef = await db.collection('tasks').add(taskData);

  return {
    id: taskRef.id,
    ...taskData,
    dueDate: formatDate(taskData.dueDate)  // Format timestamp to string for display
  };
};

// Toggle task completion (mark as completed)
const toggleTaskCompletion = async (taskId) => {
  const taskRef = db.collection('tasks').doc(taskId);
  const task = await taskRef.get();

  if (!task.exists) {
    throw new Error('Task not found');
  }

  const updatedTask = {
    ...task.data(),
    completed: !task.data()?.completed,  // Toggle completion status
  };

  await taskRef.update(updatedTask);

  return {
    id: task.id,
    ...updatedTask,
    dueDate: updatedTask.dueDate ? formatDate(updatedTask.dueDate) : null  // Format timestamp to string
  };
};

// Delete a task
const deleteTask = async (taskId) => {
  const taskRef = db.collection('tasks').doc(taskId);
  await taskRef.delete();
};

export { getAllTasks, createTask, toggleTaskCompletion, deleteTask };
