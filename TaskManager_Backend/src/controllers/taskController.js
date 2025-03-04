// src/controllers/taskController.js
import { successResponse, errorResponse } from '../utils/response.js';
import { getAllTasks, createTask, toggleTaskCompletion, deleteTask } from '../models/taskModel.js';

// Helper function to convert dd/mm/yyyy to yyyy-mm-dd format
const formatDueDate = (dueDate) => {
  const [day, month, year] = dueDate.split('/');  // Split the date by "/"
  return `${year}-${month}-${day}`;  // Reformat to yyyy-mm-dd
};

const getTasks = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    successResponse(res, tasks);
  } catch (error) {
    errorResponse(res, 'Failed to fetch tasks');
  }
};

const addTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  // Validate required fields
  if (!title || !description || !priority || !dueDate) {
    return errorResponse(res, 'All fields (title, description, priority, dueDate) are required');
  }

  // Reformat the dueDate to yyyy-mm-dd format before converting to timestamp
  const formattedDueDate = formatDueDate(dueDate);
  
  // Convert dueDate to timestamp (milliseconds)
  const dueDateTimestamp = new Date(formattedDueDate).getTime();  // Convert to timestamp in milliseconds

  console.log("dueDateTimestamp",dueDateTimestamp)
  // Ensure the timestamp is valid
  if (isNaN(dueDateTimestamp)) {
    return errorResponse(res, 'Invalid dueDate format. Use a valid date format like dd/mm/yyyy');
  }


  const taskData = { 
    title, 
    description, 
    priority, 
    completed: false, 
    dueDate: dueDateTimestamp,  // Store as timestamp
    createdAt: Date.now() 
  };

  try {
    const newTask = await createTask(taskData);
    successResponse(res, newTask, 'Task created successfully');
  } catch (error) {
    errorResponse(res, 'Failed to create task');
  }
};

const toggleCompletion = async (req, res) => {
  const taskId = req.params.id;
  try {
    const updatedTask = await toggleTaskCompletion(taskId);
    successResponse(res, updatedTask, 'Task updated successfully');
  } catch (error) {
    errorResponse(res, 'Failed to update task', 404);
  }
};

const removeTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    await deleteTask(taskId);
    res.status(204).send();
  } catch (error) {
    errorResponse(res, 'Failed to delete task');
  }
};

export { getTasks, addTask, toggleCompletion, removeTask };
